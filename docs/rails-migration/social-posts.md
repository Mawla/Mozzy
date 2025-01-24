# Social Posts Migration Guide

## Overview

This document outlines the migration of the social posts feature (formerly posts) from Mozzy's Next.js implementation to the Rails-based SocialScript application. The social posts feature transforms podcast content into engaging social media posts.

## Dependencies

- Core Processing System (see [core-processing.md](./core-processing.md))
- Template System (see [templates.md](./templates.md))
- Content transformation services
- Social media platform integrations

## Source Structure

Current location: `app/dashboard/posts/`

```typescript
app/dashboard/posts/
├── components/           # UI components
│   ├── PostEditor/
│   ├── PostPreview/
│   ├── TemplateSelector/
│   └── PlatformPreview/
├── services/            # Post-specific services
├── types/              # Type definitions
└── utils/              # Utilities
```

## Target Structure in Rails

```ruby
app/
├── models/
│   ├── social_post.rb
│   ├── social_post/
│   │   ├── template.rb
│   │   ├── variant.rb
│   │   ├── platform.rb
│   │   └── schedule.rb
├── services/
│   ├── social_posts/
│   │   ├── generator_service.rb
│   │   ├── template_service.rb
│   │   ├── platform_service.rb
│   │   └── scheduler_service.rb
├── jobs/
│   ├── social_post_generation_job.rb
│   └── social_post_publishing_job.rb
└── controllers/
    └── api/
        └── v1/
            └── social_posts_controller.rb
```

## Database Schema

### Main Tables

```ruby
create_table :social_posts do |t|
  t.string :title
  t.text :content
  t.string :status
  t.jsonb :metadata
  t.references :source, polymorphic: true  # Can be podcast or other content
  t.references :user
  t.timestamps

  t.index :status
  t.index :user_id
  t.index [:source_type, :source_id]
end

create_table :social_post_variants do |t|
  t.references :social_post
  t.string :platform          # twitter, linkedin, etc.
  t.text :content
  t.jsonb :metadata          # Platform-specific data
  t.string :status
  t.datetime :scheduled_at
  t.timestamps

  t.index :platform
  t.index :status
  t.index :scheduled_at
end

create_table :social_post_templates do |t|
  t.string :name
  t.string :platform
  t.text :content_template
  t.jsonb :metadata
  t.boolean :active, default: true
  t.timestamps

  t.index :platform
  t.index :active
end
```

## Models Implementation

### 1. Social Post Model

```ruby
# app/models/social_post.rb
class SocialPost < ApplicationRecord
  belongs_to :user
  belongs_to :source, polymorphic: true
  has_many :variants, class_name: 'SocialPost::Variant'

  validates :title, presence: true
  validates :status, inclusion: { in: %w[draft processing scheduled published failed] }

  def processing?
    status == 'processing'
  end

  def published?
    status == 'published'
  end

  def scheduled?
    status == 'scheduled'
  end
end
```

### 2. Associated Models

```ruby
# app/models/social_post/variant.rb
class SocialPost::Variant < ApplicationRecord
  belongs_to :social_post

  validates :platform, inclusion: { in: %w[twitter linkedin facebook instagram] }
  validates :content, presence: true
  validates :status, inclusion: { in: %w[draft scheduled published failed] }

  def scheduled?
    status == 'scheduled' && scheduled_at.present?
  end
end

# app/models/social_post/template.rb
class SocialPost::Template < ApplicationRecord
  validates :name, presence: true
  validates :platform, presence: true
  validates :content_template, presence: true

  scope :active, -> { where(active: true) }
  scope :for_platform, ->(platform) { where(platform: platform) }
end
```

## Services Implementation

### 1. Generator Service

```ruby
# app/services/social_posts/generator_service.rb
module SocialPosts
  class GeneratorService
    def initialize(social_post)
      @social_post = social_post
    end

    def generate
      @social_post.update!(status: 'processing')

      ActiveRecord::Base.transaction do
        generate_variants
        @social_post.update!(status: 'draft')
      end
    rescue => e
      handle_generation_error(e)
    end

    private

    def generate_variants
      SocialPost::Template.active.find_each do |template|
        content = TemplateService.new(template).render(@social_post.source)

        @social_post.variants.create!(
          platform: template.platform,
          content: content,
          status: 'draft',
          metadata: {
            template_id: template.id,
            generated_at: Time.current
          }
        )
      end
    end

    def handle_generation_error(error)
      @social_post.update!(
        status: 'failed',
        metadata: {
          error: error.message,
          backtrace: error.backtrace
        }
      )
      raise error
    end
  end
end
```

### 2. Platform Service

```ruby
# app/services/social_posts/platform_service.rb
module SocialPosts
  class PlatformService
    def initialize(variant)
      @variant = variant
    end

    def publish
      client = platform_client
      result = client.create_post(@variant.content, @variant.metadata)

      @variant.update!(
        status: 'published',
        metadata: @variant.metadata.merge(
          platform_post_id: result.id,
          published_at: Time.current
        )
      )
    rescue => e
      handle_publishing_error(e)
    end

    private

    def platform_client
      case @variant.platform
      when 'twitter'
        TwitterClient.new
      when 'linkedin'
        LinkedInClient.new
      else
        raise "Unsupported platform: #{@variant.platform}"
      end
    end
  end
end
```

## Background Jobs

```ruby
# app/jobs/social_post_generation_job.rb
class SocialPostGenerationJob < ApplicationJob
  queue_as :social_posts

  def perform(social_post_id)
    social_post = SocialPost.find(social_post_id)
    SocialPosts::GeneratorService.new(social_post).generate
  rescue => e
    social_post.update!(
      status: 'failed',
      metadata: {
        error: e.message,
        backtrace: e.backtrace
      }
    )
    raise e
  end
end

# app/jobs/social_post_publishing_job.rb
class SocialPostPublishingJob < ApplicationJob
  queue_as :social_posts

  def perform(variant_id)
    variant = SocialPost::Variant.find(variant_id)
    SocialPosts::PlatformService.new(variant).publish
  end
end
```

## API Implementation

```ruby
# app/controllers/api/v1/social_posts_controller.rb
module Api
  module V1
    class SocialPostsController < ApplicationController
      def create
        social_post = current_user.social_posts.build(social_post_params)

        if social_post.save
          SocialPostGenerationJob.perform_later(social_post.id)
          render json: social_post, status: :created
        else
          render json: { errors: social_post.errors }, status: :unprocessable_entity
        end
      end

      def update
        social_post = current_user.social_posts.find(params[:id])

        if social_post.update(social_post_params)
          render json: social_post
        else
          render json: { errors: social_post.errors }, status: :unprocessable_entity
        end
      end

      private

      def social_post_params
        params.require(:social_post).permit(:title, :content, :source_id, :source_type)
      end
    end
  end
end
```

## Frontend Components Migration

The frontend components will be reimplemented in Rails views using Hotwire (Turbo and Stimulus):

```ruby
# app/views/social_posts/edit.html.erb
<div data-controller="social-post-editor">
  <div data-social-post-editor-target="editor">
    <%= render "editor", social_post: @social_post %>
  </div>

  <div data-social-post-editor-target="preview">
    <%= render "preview", variants: @social_post.variants %>
  </div>

  <div data-social-post-editor-target="scheduler">
    <%= render "scheduler", variants: @social_post.variants %>
  </div>
</div>
```

```javascript
// app/javascript/controllers/social_post_editor_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["editor", "preview", "scheduler"];

  connect() {
    this.setupEditor();
    this.setupPreviewSync();
    this.setupScheduler();
  }

  // Implementation details...
}
```

## Migration Steps

1. Database Setup:

   ```bash
   rails generate migration CreateSocialPostTables
   rails db:migrate
   ```

2. Models and Services:

   ```bash
   # Generate models
   rails generate model SocialPost
   rails generate model SocialPost::Variant
   rails generate model SocialPost::Template

   # Generate services
   rails generate service SocialPosts::GeneratorService
   rails generate service SocialPosts::PlatformService
   ```

3. Background Jobs:

   ```bash
   rails generate job SocialPostGeneration
   rails generate job SocialPostPublishing
   ```

4. Frontend Setup:
   ```bash
   rails generate stimulus social_post_editor
   ```

## Testing Strategy

```ruby
# spec/models/social_post_spec.rb
RSpec.describe SocialPost do
  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_inclusion_of(:status).in_array(%w[draft processing scheduled published failed]) }
  end

  describe "associations" do
    it { should belong_to(:user) }
    it { should belong_to(:source) }
    it { should have_many(:variants) }
  end
end

# spec/services/social_posts/generator_service_spec.rb
RSpec.describe SocialPosts::GeneratorService do
  describe "#generate" do
    it "generates variants for each active template" do
      social_post = create(:social_post)
      templates = create_list(:social_post_template, 3, :active)

      expect {
        described_class.new(social_post).generate
      }.to change { social_post.variants.count }.by(3)
    end
  end
end
```

## Validation Checklist

- [ ] Database migrations created and tested
- [ ] Models implemented with validations
- [ ] Services implemented and tested
- [ ] Background jobs configured
- [ ] API endpoints implemented
- [ ] Frontend components migrated
- [ ] Integration tests passing

## Rollback Plan

1. Database:

   ```ruby
   rails db:rollback STEP=1
   ```

2. Code:

   ```bash
   git revert HEAD
   ```

3. Background Jobs:
   ```ruby
   Sidekiq::Queue.new('social_posts').clear
   ```

## Monitoring

1. Add social post metrics:

   ```ruby
   # config/initializers/metrics.rb
   SOCIAL_POST_METRICS = [
     'social_post.generation.started',
     'social_post.generation.completed',
     'social_post.publishing.started',
     'social_post.publishing.completed',
     'social_post.generation.failed',
     'social_post.publishing.failed'
   ].freeze
   ```

2. Track performance:
   ```ruby
   ActiveSupport::Notifications.instrument(
     'social_post.generation.completed',
     social_post_id: social_post.id,
     duration: Time.current - start_time
   )
   ```
