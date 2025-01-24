# Prompts Migration Guide

## Overview

This document outlines the process of migrating prompts from Mozzy's Next.js implementation to the Rails-based SocialScript application. Prompts are essential for AI interactions and content processing.

## Source Data

### Current Locations

```
~/dev/frontend/mozzy/app/prompts/
~/dev/frontend/mozzy/app/prompts/podcasts/
```

### File Structure

```
app/prompts/
├── podcasts/
│   ├── index.ts
│   ├── analyzeContent.ts
│   ├── extractEntities.ts
│   ├── createTimeline.ts
│   ├── refineTranscript.ts
│   ├── synthesis.ts
│   ├── combineResults.ts
│   └── detectEvents.ts
└── podcastPrompts.ts
```

## Migration Strategy

### 1. Consolidated Structure in Rails

```ruby
# In Rails app
app/
└── services/
    └── prompts/
        ├── base.rb           # Base prompt functionality
        ├── podcast.rb        # Main podcast prompts
        └── podcast/          # Specific podcast prompts
            ├── analyzer.rb
            ├── entity_extractor.rb
            ├── timeline_creator.rb
            ├── transcript_refiner.rb
            ├── synthesizer.rb
            ├── results_combiner.rb
            └── event_detector.rb
```

## Database Schema

### Tables

```ruby
create_table :prompts do |t|
  t.string :name
  t.string :category        # e.g., 'podcast', 'post'
  t.string :subcategory     # e.g., 'analysis', 'extraction'
  t.text :content          # The actual prompt template
  t.jsonb :metadata        # Additional configuration
  t.boolean :active, default: true
  t.timestamps

  t.index [:category, :subcategory]
  t.index :name
end
```

## Implementation

### 1. Base Prompt Service

```ruby
# app/services/prompts/base.rb
module Prompts
  class Base
    def self.load_from_yaml
      YAML.load_file(Rails.root.join('config/prompts.yml'))
    end

    def self.render(template_name, variables = {})
      template = find_template(template_name)
      template % variables
    end

    private

    def self.find_template(name)
      prompts = load_from_yaml
      prompts.dig(name) || raise("Prompt template '#{name}' not found")
    end
  end
end
```

### 2. Podcast Prompt Service

```ruby
# app/services/prompts/podcast.rb
module Prompts
  class Podcast < Base
    def self.refine_transcript(transcript)
      render('podcast.refine_transcript', transcript: transcript)
    end

    def self.extract_entities(text)
      render('podcast.extract_entities', text: text)
    end

    def self.create_timeline(content)
      render('podcast.create_timeline', content: content)
    end

    # Additional prompt methods...
  end
end
```

### 3. Configuration

```yaml
# config/prompts.yml
podcast:
  refine_transcript: |
    Process this podcast transcript to create a clean, organized version:

    1. Remove unnecessary content like:
       - Casual banter and jokes
       - Off-topic stories
       - Repetitive phrases
       - Filler words and sounds

    2. Preserve:
       - Key insights and main points
       - Important examples and case studies
       - Relevant expert opinions
       - Critical definitions and explanations

    3. Organize the content into clear sections
    4. Maintain the logical flow of ideas
    5. Keep important quotes that add value

    Transcript:
    %{transcript}

    Return the response as JSON:
    {
      "refinedContent": "The cleaned transcript..."
    }

  extract_entities: |
    Extract and categorize entities from this podcast transcript chunk with rich context and relationships.
    Focus on key information that provides value for research and knowledge representation.

    %{text}

    Guidelines:
    1. Entity Identification and Classification...
    [Rest of the prompt template]
```

## Migration Process

### 1. File Setup

1. Create prompts directory:

   ```bash
   mkdir -p ~/dev/rails/social_script/app/services/prompts/podcast
   ```

2. Create configuration:
   ```bash
   mkdir -p ~/dev/rails/social_script/config
   touch ~/dev/rails/social_script/config/prompts.yml
   ```

### 2. Migration Steps

1. Convert TypeScript prompts to YAML:

   ```bash
   # Script to convert prompts
   ruby -r yaml -e '
     Dir.glob("app/prompts/**/*.ts").each do |file|
       content = File.read(file)
       # Extract prompt template
       template = content.match(/`(.*)`/m)[1]
       # Convert to YAML structure
       yaml = { File.basename(file, ".ts") => template }
       File.write("config/prompts.yml", yaml.to_yaml)
     end
   '
   ```

2. Create prompt services:

   ```bash
   rails generate service Prompts::Base
   rails generate service Prompts::Podcast
   ```

3. Implement services and configure prompts

### 3. Testing

```ruby
# spec/services/prompts/podcast_spec.rb
RSpec.describe Prompts::Podcast do
  describe '.refine_transcript' do
    it 'renders the refine transcript prompt' do
      transcript = 'Sample transcript'
      result = described_class.refine_transcript(transcript)
      expect(result).to include('Process this podcast transcript')
      expect(result).to include(transcript)
    end
  end
end
```

## Usage Example

```ruby
# In a Rails controller or service
class PodcastProcessingService
  def process_transcript(transcript)
    prompt = Prompts::Podcast.refine_transcript(transcript)
    # Use prompt with AI service...
  end

  def extract_entities(text)
    prompt = Prompts::Podcast.extract_entities(text)
    # Use prompt with AI service...
  end
end
```

## Validation Checklist

- [ ] All prompts converted to YAML format
- [ ] Base prompt service implemented
- [ ] Podcast prompt service implemented
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Example usage documented
- [ ] Rollback plan documented

## Monitoring

1. Add prompt usage tracking:

   ```ruby
   # app/services/prompts/base.rb
   def self.render(template_name, variables = {})
     Monitoring.increment("prompt.render", tags: ["template:#{template_name}"])
     template = find_template(template_name)
     template % variables
   end
   ```

2. Monitor prompt performance:
   ```ruby
   # app/services/prompts/base.rb
   def self.render(template_name, variables = {})
     start_time = Time.current
     result = template % variables
     duration = Time.current - start_time
     Monitoring.timing("prompt.render_time", duration, tags: ["template:#{template_name}"])
     result
   end
   ```
