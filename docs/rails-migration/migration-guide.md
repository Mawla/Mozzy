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

## Phase 2: Feature Migration

[Rest of the file remains unchanged...]
