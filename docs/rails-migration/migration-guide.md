# SocialScript Migration Guide

## Overview

This guide provides step-by-step instructions for migrating Mozzy's functionality to the Rails-based SocialScript application. The migration will be performed in phases to ensure minimal disruption and maintain data integrity.

## Prerequisites

- Ruby 3.3.0
- PostgreSQL
- Redis
- Node.js (for potential asset compilation)
- AWS credentials
- Development environment variables

## Phase 1: Core Setup (2025-01-24)

### 1. Environment Configuration

1. Copy environment variables:

   ```bash
   # In ~/dev/rails/social_script
   cp ~/dev/frontend/mozzy/.env.local .env
   ```

2. Update database.yml:

   ```yaml
   default: &default
     adapter: postgresql
     encoding: unicode
     pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>

   development:
     <<: *default
     database: social_script_development

   test:
     <<: *default
     database: social_script_test

   production:
     <<: *default
     url: <%= ENV['DATABASE_URL'] %>
   ```

3. Configure Redis:

   ```ruby
   # config/initializers/redis.rb
   REDIS_CONFIG = {
     url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1'),
     password: ENV.fetch('REDIS_PASSWORD', nil)
   }

   Redis.current = Redis.new(REDIS_CONFIG)
   ```

### 2. Authentication Setup

1. Configure Devise:

   ```bash
   rails generate devise:install
   rails generate devise User
   ```

2. Set up JWT:

   ```ruby
   # config/initializers/devise.rb
   config.jwt do |jwt|
     jwt.secret = ENV['DEVISE_JWT_SECRET_KEY']
     jwt.dispatch_requests = [
       ['POST', %r{^/login$}]
     ]
     jwt.revocation_requests = [
       ['DELETE', %r{^/logout$}]
     ]
   end
   ```

3. Create User model:
   ```ruby
   class User < ApplicationRecord
     devise :database_authenticatable, :registerable,
            :recoverable, :rememberable, :validatable,
            :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist
   end
   ```

### 3. Core Processing Setup

1. Create processing models:

   ```bash
   rails g model Podcast title:string description:text user:references
   rails g model Episode title:string audio_url:string podcast:references
   rails g model Post content:text status:string user:references
   rails g model Transformation transformable:references{polymorphic} status:string
   ```

2. Set up Sidekiq:

   ```ruby
   # config/initializers/sidekiq.rb
   Sidekiq.configure_server do |config|
     config.redis = REDIS_CONFIG
   end

   Sidekiq.configure_client do |config|
     config.redis = REDIS_CONFIG
   end
   ```

### 4. File Storage Setup

1. Configure Active Storage:

   ```bash
   rails active_storage:install
   ```

2. Set up S3:
   ```ruby
   # config/storage.yml
   amazon:
     service: S3
     access_key_id: <%= ENV['AWS_ACCESS_KEY_ID'] %>
     secret_access_key: <%= ENV['AWS_SECRET_ACCESS_KEY'] %>
     region: <%= ENV['AWS_REGION'] %>
     bucket: <%= ENV['AWS_BUCKET'] %>
   ```

### 5. Template Migration

See [Template Migration Guide](./templates.md) for detailed instructions on migrating the template system.

Key steps:

1. Copy `alltemplates.json` to seeds directory
2. Create template models and migrations
3. Set up import service
4. Run migrations and import data
5. Verify template functionality

## Phase 2: Data Migration Strategy

### 1. Data Export Process

```bash
# Export data from Supabase
supabase db dump -f mozzy_data_dump.sql

# Export specific tables (if needed)
supabase db dump -t users,podcasts,posts -f specific_tables.sql
```

### 2. Data Transformation

1. Schema Mapping:

   ```ruby
   # config/initializers/schema_mapping.rb
   SCHEMA_MAPPING = {
     'mozzy_users' => 'users',
     'mozzy_podcasts' => 'podcasts',
     'mozzy_posts' => 'social_posts',
     # Add other table mappings
   }
   ```

2. Data Transformation Service:
   ```ruby
   # lib/tasks/data_migration.rake
   namespace :data_migration do
     desc 'Transform and import data from Mozzy'
     task transform_and_import: :environment do
       DataMigration::TransformationService.new.perform
     end
   end
   ```

### 3. Import Procedures

1. Database Import:

   ```ruby
   # lib/tasks/data_migration.rake
   namespace :data_migration do
     desc 'Import transformed data'
     task import: :environment do
       Rails.logger.info "Starting data import at #{Time.current}"

       ActiveRecord::Base.transaction do
         # Import users first
         User.import transformed_users

         # Import podcasts with user associations
         Podcast.import transformed_podcasts

         # Import posts with user associations
         SocialPost.import transformed_posts
       end

       Rails.logger.info "Completed data import at #{Time.current}"
     end
   end
   ```

2. File Storage Migration:
   ```ruby
   # app/services/data_migration/storage_migration_service.rb
   module DataMigration
     class StorageMigrationService
       def migrate_files
         migrate_podcast_files
         migrate_post_attachments
         migrate_user_avatars
       end

       private

       def migrate_podcast_files
         Podcast.find_each do |podcast|
           next unless podcast.original_audio_url

           begin
             download_and_attach(
               podcast,
               :audio_file,
               podcast.original_audio_url
             )
           rescue => e
             log_error(podcast, e)
           end
         end
       end
     end
   end
   ```

### 4. Validation & Rollback

1. Validation Service:

   ```ruby
   # app/services/data_migration/validation_service.rb
   module DataMigration
     class ValidationService
       def validate_migration
         validate_user_data
         validate_podcast_data
         validate_post_data
         validate_relationships
         validate_file_attachments
       end

       private

       def validate_user_data
         # Compare user counts
         original_count = Legacy::User.count
         new_count = User.count

         raise "User count mismatch" unless original_count == new_count

         # Validate specific users
         User.find_each do |user|
           validate_user(user)
         end
       end
     end
   end
   ```

2. Rollback Procedures:
   ```ruby
   # lib/tasks/data_migration.rake
   namespace :data_migration do
     desc 'Rollback migration'
     task rollback: :environment do
       if ENV['CONFIRM_ROLLBACK'] != 'yes'
         puts "Please run with CONFIRM_ROLLBACK=yes to proceed"
         exit
       end

       ActiveRecord::Base.transaction do
         # Clear new tables in reverse dependency order
         SocialPost.delete_all
         Podcast.delete_all
         User.delete_all

         # Clear uploaded files
         Rails.application.config.active_storage.service.delete_all

         # Reset sequences
         ActiveRecord::Base.connection.reset_pk_sequence!('users')
         ActiveRecord::Base.connection.reset_pk_sequence!('podcasts')
         ActiveRecord::Base.connection.reset_pk_sequence!('social_posts')
       end
     end
   end
   ```

### 5. Migration Monitoring

1. Progress Tracking:

   ```ruby
   # config/initializers/migration_progress.rb
   MIGRATION_STEPS = [
     'users',
     'podcasts',
     'social_posts',
     'files',
     'validation'
   ].freeze

   # app/services/data_migration/progress_service.rb
   module DataMigration
     class ProgressService
       def self.track(step)
         Redis.current.sadd('migration:completed_steps', step)
       end

       def self.progress
         completed = Redis.current.smembers('migration:completed_steps')
         (completed.size.to_f / MIGRATION_STEPS.size * 100).round(2)
       end
     end
   end
   ```

2. Error Handling:
   ```ruby
   # app/services/data_migration/error_handler.rb
   module DataMigration
     class ErrorHandler
       def self.log_error(entity, error)
         Rails.logger.error(
           "Migration failed for #{entity.class}##{entity.id}: #{error.message}"
         )

         ErrorTracker.notify(
           error,
           context: {
             entity_type: entity.class.name,
             entity_id: entity.id,
             migration_step: current_step
           }
         )
       end
     end
   end
   ```

### 6. Running the Migration

```bash
# 1. Export data
bundle exec rake data_migration:export

# 2. Transform and import
bundle exec rake data_migration:transform_and_import

# 3. Validate
bundle exec rake data_migration:validate

# 4. If validation fails, rollback
CONFIRM_ROLLBACK=yes bundle exec rake data_migration:rollback
```

## Phase 2: Feature Migration

[Rest of the file remains unchanged...]
