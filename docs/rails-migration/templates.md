# Template Migration Guide

## Overview

This document outlines the process of migrating templates from Mozzy's Next.js implementation to the Rails-based SocialScript application. Templates are a core feature used for content generation and transformation.

## Source Data

### Current Location

```
~/dev/frontend/mozzy/public/packs/alltemplates.json
```

### Data Structure

```typescript
interface Template {
  id: string;
  name: string;
  title?: string;
  description: string;
  body: string;
  emoji: string;
  format: string;
  uses: number;
  walkthroughVideo: string | null;
  slug: string;
  packId: string;
  tags: string[];
}
```

## Database Schema

### Tables

1. **Templates**

```ruby
create_table :templates do |t|
  t.string :external_id        # Original id from JSON
  t.string :name
  t.string :title
  t.text :description
  t.text :body
  t.string :emoji
  t.string :format
  t.integer :uses, default: 0
  t.string :walkthrough_video
  t.string :slug
  t.references :pack
  t.timestamps

  t.index :external_id
  t.index :slug
end
```

2. **Packs**

```ruby
create_table :packs do |t|
  t.string :external_id
  t.string :name
  t.string :emoji
  t.timestamps

  t.index :external_id
end
```

3. **Template Tags**

```ruby
create_table :template_tags do |t|
  t.references :template
  t.string :name
  t.timestamps

  t.index :name
end
```

## Migration Process

### 1. File Setup

1. Create seeds directory:

   ```bash
   mkdir -p ~/dev/rails/social_script/db/seeds
   ```

2. Copy templates file:
   ```bash
   cp ~/dev/frontend/mozzy/public/packs/alltemplates.json ~/dev/rails/social_script/db/seeds/templates.json
   ```

### 2. Rails Models

1. **Template Model** (`app/models/template.rb`):

   ```ruby
   class Template < ApplicationRecord
     belongs_to :pack
     has_many :template_tags, dependent: :destroy

     validates :name, presence: true
     validates :body, presence: true
     validates :external_id, presence: true, uniqueness: true
     validates :slug, presence: true, uniqueness: true

     scope :by_format, ->(format) { where(format: format) }
     scope :by_pack, ->(pack_id) { where(pack_id: pack_id) }
     scope :most_used, -> { order(uses: :desc) }
   end
   ```

2. **Pack Model** (`app/models/pack.rb`):

   ```ruby
   class Pack < ApplicationRecord
     has_many :templates, dependent: :destroy

     validates :name, presence: true
     validates :external_id, presence: true, uniqueness: true
   end
   ```

3. **TemplateTag Model** (`app/models/template_tag.rb`):
   ```ruby
   class TemplateTag < ApplicationRecord
     belongs_to :template

     validates :name, presence: true

     scope :by_name, ->(name) { where(name: name) }
   end
   ```

### 3. Import Service

Create a service to handle template importing (`app/services/templates/importer.rb`):

```ruby
module Templates
  class Importer
    def self.import_from_json
      json_file = Rails.root.join('db/seeds/templates.json')
      templates = JSON.parse(File.read(json_file))

      ActiveRecord::Base.transaction do
        templates.each do |template_data|
          pack = Pack.find_or_create_by!(
            external_id: template_data['packId'],
            name: template_data['name'],
            emoji: template_data['emoji']
          )

          template = Template.create!(
            external_id: template_data['id'],
            name: template_data['name'],
            title: template_data['title'],
            description: template_data['description'],
            body: template_data['body'],
            emoji: template_data['emoji'],
            format: template_data['format'],
            uses: template_data['uses'],
            walkthrough_video: template_data['walkthroughVideo'],
            slug: template_data['slug'],
            pack: pack
          )

          template_data['tags']&.each do |tag_name|
            TemplateTag.create!(
              template: template,
              name: tag_name
            )
          end
        end
      end
    end
  end
end
```

### 4. Migration Steps

1. Run database migrations:

   ```bash
   rails db:migrate
   ```

2. Import templates:

   ```bash
   rails runner 'Templates::Importer.import_from_json'
   ```

3. Verify import:
   ```ruby
   # In Rails console
   Template.count
   Pack.count
   TemplateTag.count
   ```

## API Endpoints

### Template Endpoints

```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :templates do
      collection do
        get :search
        get :by_format
      end
      member do
        post :increment_uses
      end
    end
    resources :packs do
      resources :templates, only: [:index]
    end
  end
end
```

### Response Format

```ruby
# JSON:API format
{
  "data": {
    "id": "1",
    "type": "templates",
    "attributes": {
      "name": "Template Name",
      "title": "Template Title",
      "description": "Template Description",
      "body": "Template Body",
      "emoji": "🚀",
      "format": "Tweet",
      "uses": 100,
      "slug": "template-slug"
    },
    "relationships": {
      "pack": {
        "data": { "id": "1", "type": "packs" }
      },
      "tags": {
        "data": [
          { "id": "1", "type": "template_tags" }
        ]
      }
    }
  }
}
```

## Testing

### RSpec Tests

1. Model Tests:

   ```ruby
   # spec/models/template_spec.rb
   RSpec.describe Template, type: :model do
     it { should belong_to(:pack) }
     it { should have_many(:template_tags) }
     it { should validate_presence_of(:name) }
     it { should validate_presence_of(:body) }
     it { should validate_uniqueness_of(:external_id) }
     it { should validate_uniqueness_of(:slug) }
   end
   ```

2. Import Service Tests:
   ```ruby
   # spec/services/templates/importer_spec.rb
   RSpec.describe Templates::Importer do
     describe '.import_from_json' do
       it 'imports templates from JSON file' do
         expect {
           described_class.import_from_json
         }.to change(Template, :count)
           .and change(Pack, :count)
           .and change(TemplateTag, :count)
       end
     end
   end
   ```

## Rollback Plan

1. Keep backup of original JSON:

   ```bash
   cp ~/dev/rails/social_script/db/seeds/templates.json ~/dev/rails/social_script/db/seeds/templates.backup.json
   ```

2. Create rollback migration:
   ```ruby
   class RollbackTemplates < ActiveRecord::Migration[7.2]
     def up
       drop_table :template_tags
       drop_table :templates
       drop_table :packs
     end

     def down
       # Original creation migrations
     end
   end
   ```

## Monitoring

1. Add template-specific metrics:

   ```ruby
   # app/controllers/api/v1/templates_controller.rb
   def show
     Monitoring.increment("template.views", tags: ["template:#{@template.id}"])
   end
   ```

2. Monitor template usage:

   ```ruby
   # app/models/template.rb
   after_update :record_usage_metrics, if: :saved_change_to_uses?

   private

   def record_usage_metrics
     Monitoring.gauge("template.uses", uses, tags: ["template:#{id}"])
   end
   ```
