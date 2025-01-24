# Podcast Feature Migration Guide

## Overview

This document outlines the migration of the podcast feature from Mozzy's Next.js implementation to the Rails-based SocialScript application. The podcast feature transforms audio content into rich visual experiences.

## Dependencies

- Core Processing System (see [core-processing.md](./core-processing.md))
- Audio processing capabilities
- Text transformation services
- Content templating system

## Source Structure

Current location: `app/dashboard/podcasts/`

```typescript
app/dashboard/podcasts/
├── components/           # UI components
│   ├── PodcastUploader/
│   ├── PodcastPlayer/
│   ├── TranscriptView/
│   └── TimelineView/
├── services/            # Podcast-specific services
├── types/              # Type definitions
└── utils/              # Utilities
```

## Target Structure in Rails

```ruby
app/
├── models/
│   ├── podcast.rb
│   ├── podcast/
│   │   ├── transcript.rb
│   │   ├── timeline.rb
│   │   ├── entity.rb
│   │   └── speaker.rb
├── services/
│   ├── podcasts/
│   │   ├── uploader_service.rb
│   │   ├── transcription_service.rb
│   │   ├── analysis_service.rb
│   │   └── visualization_service.rb
├── jobs/
│   ├── podcast_processing_job.rb
│   └── podcast_cleanup_job.rb
└── controllers/
    └── api/
        └── v1/
            └── podcasts_controller.rb
```

## Database Schema

### Main Tables

```ruby
create_table :podcasts do |t|
  t.string :title
  t.text :description
  t.string :audio_url
  t.string :status
  t.jsonb :metadata
  t.references :user
  t.timestamps

  t.index :status
  t.index :user_id
end

create_table :podcast_transcripts do |t|
  t.references :podcast
  t.text :content
  t.jsonb :segments
  t.jsonb :speakers
  t.timestamps

  t.index :podcast_id
end

create_table :podcast_timelines do |t|
  t.references :podcast
  t.jsonb :events
  t.timestamps

  t.index :podcast_id
end

create_table :podcast_entities do |t|
  t.references :podcast
  t.string :name
  t.string :entity_type
  t.jsonb :metadata
  t.timestamps

  t.index [:podcast_id, :entity_type]
end
```

## Models Implementation

### 1. Podcast Model

```ruby
# app/models/podcast.rb
class Podcast < ApplicationRecord
  belongs_to :user
  has_one :transcript, class_name: 'Podcast::Transcript'
  has_one :timeline, class_name: 'Podcast::Timeline'
  has_many :entities, class_name: 'Podcast::Entity'

  has_one_attached :audio_file

  validates :title, presence: true
  validates :audio_file, presence: true
  validates :status, inclusion: { in: %w[pending processing completed failed] }

  def processing?
    status == 'processing'
  end

  def processed?
    status == 'completed'
  end
end
```

### 2. Associated Models

```ruby
# app/models/podcast/transcript.rb
class Podcast::Transcript < ApplicationRecord
  belongs_to :podcast

  def segments_by_speaker(speaker_id)
    segments.select { |s| s['speaker_id'] == speaker_id }
  end
end

# app/models/podcast/timeline.rb
class Podcast::Timeline < ApplicationRecord
  belongs_to :podcast

  def events_by_type(type)
    events.select { |e| e['type'] == type }
  end
end
```

## Services Implementation

### 1. Uploader Service

```ruby
# app/services/podcasts/uploader_service.rb
module Podcasts
  class UploaderService
    def initialize(podcast)
      @podcast = podcast
    end

    def upload(file)
      @podcast.audio_file.attach(file)
      @podcast.update!(status: 'pending')
      PodcastProcessingJob.perform_later(@podcast.id)
    rescue => e
      handle_upload_error(e)
    end

    private

    def handle_upload_error(error)
      @podcast.update!(
        status: 'failed',
        metadata: {
          error: error.message,
          stage: 'upload'
        }
      )
      raise error
    end
  end
end
```

### 2. Transcription Service

```ruby
# app/services/podcasts/transcription_service.rb
module Podcasts
  class TranscriptionService
    def initialize(podcast)
      @podcast = podcast
    end

    def transcribe
      audio_url = @podcast.audio_file.url
      result = transcription_provider.transcribe(audio_url)

      Podcast::Transcript.create!(
        podcast: @podcast,
        content: result.text,
        segments: result.segments,
        speakers: result.speakers
      )
    end

    private

    def transcription_provider
      # Initialize your transcription provider (e.g., Whisper, AssemblyAI)
    end
  end
end
```

## Background Jobs

```ruby
# app/jobs/podcast_processing_job.rb
class PodcastProcessingJob < ApplicationJob
  queue_as :podcast_processing

  def perform(podcast_id)
    podcast = Podcast.find(podcast_id)

    ActiveRecord::Base.transaction do
      # Step 1: Transcription
      Podcasts::TranscriptionService.new(podcast).transcribe

      # Step 2: Analysis
      Podcasts::AnalysisService.new(podcast).analyze

      # Step 3: Timeline Generation
      Podcasts::TimelineService.new(podcast).generate

      # Step 4: Entity Extraction
      Podcasts::EntityService.new(podcast).extract

      podcast.update!(status: 'completed')
    end
  rescue => e
    podcast.update!(
      status: 'failed',
      metadata: {
        error: e.message,
        backtrace: e.backtrace
      }
    )
    raise e
  end
end
```

## API Implementation

```ruby
# app/controllers/api/v1/podcasts_controller.rb
module Api
  module V1
    class PodcastsController < ApplicationController
      def create
        podcast = current_user.podcasts.build(podcast_params)

        if podcast.save
          Podcasts::UploaderService.new(podcast).upload(params[:file])
          render json: podcast, status: :created
        else
          render json: { errors: podcast.errors }, status: :unprocessable_entity
        end
      end

      def show
        podcast = Podcast.find(params[:id])
        render json: PodcastSerializer.new(podcast).as_json
      end

      private

      def podcast_params
        params.require(:podcast).permit(:title, :description)
      end
    end
  end
end
```

## Frontend Components Migration

The frontend components will be reimplemented in Rails views using Hotwire (Turbo and Stimulus):

```ruby
# app/views/podcasts/show.html.erb
<div data-controller="podcast-player">
  <div data-podcast-player-target="player">
    <%= render "player", podcast: @podcast %>
  </div>

  <div data-podcast-player-target="transcript">
    <%= render "transcript", transcript: @podcast.transcript %>
  </div>

  <div data-podcast-player-target="timeline">
    <%= render "timeline", timeline: @podcast.timeline %>
  </div>
</div>
```

```javascript
// app/javascript/controllers/podcast_player_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["player", "transcript", "timeline"];

  connect() {
    this.setupPlayer();
    this.setupTranscriptSync();
    this.setupTimelineSync();
  }

  // Implementation details...
}
```

## Migration Steps

1. Database Setup:

   ```bash
   rails generate migration CreatePodcastTables
   rails db:migrate
   ```

2. Models and Services:

   ```bash
   # Generate models
   rails generate model Podcast
   rails generate model Podcast::Transcript
   rails generate model Podcast::Timeline
   rails generate model Podcast::Entity

   # Generate services
   rails generate service Podcasts::UploaderService
   rails generate service Podcasts::TranscriptionService
   rails generate service Podcasts::AnalysisService
   ```

3. Controllers and Routes:

   ```bash
   rails generate controller Api::V1::Podcasts
   ```

4. Frontend Setup:
   ```bash
   rails generate stimulus podcast_player
   ```

## Testing Strategy

```ruby
# spec/models/podcast_spec.rb
RSpec.describe Podcast do
  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:audio_file) }
  end

  describe "associations" do
    it { should belong_to(:user) }
    it { should have_one(:transcript) }
    it { should have_one(:timeline) }
    it { should have_many(:entities) }
  end
end

# spec/services/podcasts/uploader_service_spec.rb
RSpec.describe Podcasts::UploaderService do
  describe "#upload" do
    it "processes the uploaded file" do
      podcast = create(:podcast)
      file = fixture_file_upload("test.mp3")

      expect {
        described_class.new(podcast).upload(file)
      }.to change { podcast.reload.status }.from("pending").to("processing")
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
   Sidekiq::Queue.new('podcast_processing').clear
   ```

## Monitoring

1. Add podcast metrics:

   ```ruby
   # config/initializers/metrics.rb
   PODCAST_METRICS = [
     'podcast.upload.started',
     'podcast.upload.completed',
     'podcast.processing.started',
     'podcast.processing.completed',
     'podcast.processing.failed',
     'podcast.processing.duration'
   ].freeze
   ```

2. Track performance:
   ```ruby
   ActiveSupport::Notifications.instrument(
     'podcast.processing.completed',
     podcast_id: podcast.id,
     duration: Time.current - start_time
   )
   ```
