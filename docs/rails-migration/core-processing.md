# Core Processing Migration Guide

## Overview

This document outlines the migration of the core processing system from Mozzy's Next.js implementation to the Rails-based SocialScript application. The core processing system is the foundation for both podcast and social posts features, as defined in [Project Requirements](../project_requirements_document.md#core-features).

## Source Structure

Current location: `app/core/processing/` (ref: [File Structure](../file_structure_document.md))

```typescript
app/core/processing/
├── adapters/          # Format-specific adapters
├── base/             # Base classes and interfaces
├── config/           # Processing configuration
├── errors/           # Error definitions
├── factories/        # Processing factories
├── podcast/          # Podcast processing
├── post/            # Post processing
├── services/        # Service implementations
├── strategies/      # Processing strategies
├── types/           # Type definitions
└── utils/           # Utilities
```

## Target Structure in Rails

Based on [Backend Structure](../backend_structure_document.md):

```ruby
app/
├── models/
│   ├── processing/
│   │   ├── base.rb
│   │   ├── podcast.rb
│   │   └── social_post.rb
├── services/
│   ├── processing/
│   │   ├── base_processor.rb
│   │   ├── podcast_processor.rb
│   │   └── social_post_processor.rb
│   ├── adapters/
│   │   ├── base_adapter.rb
│   │   ├── podcast_adapter.rb
│   │   └── social_post_adapter.rb
│   └── strategies/
│       ├── base_strategy.rb
│       ├── podcast/
│       └── social_post/
└── lib/
    └── processing/
        ├── errors.rb
        ├── types.rb
        └── utils.rb
```

## Database Schema

Following [Tech Stack](../tech_stack_document.md#backend--storage) guidelines:

```ruby
create_table :processing_records do |t|
  t.string :format              # podcast, social_post
  t.string :status             # pending, processing, completed, failed
  t.jsonb :options             # Processing options
  t.jsonb :result              # Processing result
  t.jsonb :error_details       # Error information if failed
  t.float :progress            # Overall progress (0-100)
  t.references :processable, polymorphic: true
  t.timestamps

  t.index :format
  t.index :status
  t.index [:processable_type, :processable_id]
end

create_table :processing_steps do |t|
  t.references :processing_record
  t.string :name
  t.string :status
  t.float :progress
  t.text :description
  t.jsonb :data
  t.jsonb :error_details
  t.timestamps

  t.index [:processing_record_id, :name]
  t.index :status
end
```

## Type System Migration

### 1. Base Types Module

Following [System Prompts](../system_prompts_document.md) for AI processing:

```ruby
# lib/processing/types.rb
module Processing
  module Types
    extend ActiveSupport::Concern

    FORMATS = %w[podcast social_post].freeze
    QUALITIES = %w[draft final].freeze
    STATUSES = %w[pending processing completed failed error].freeze

    class ProcessingError < StandardError; end
    class ValidationError < ProcessingError; end
    class AdapterError < ProcessingError; end
    class StrategyError < ProcessingError; end
  end
end
```

### 2. Base Processing Model

Based on [Backend Structure](../backend_structure_document.md):

```ruby
# app/models/processing/base.rb
module Processing
  class Base < ApplicationRecord
    include Processing::Types

    belongs_to :processable, polymorphic: true
    has_many :steps, class_name: 'Processing::Step'

    validates :format, inclusion: { in: FORMATS }
    validates :status, inclusion: { in: STATUSES }

    def progress
      steps.average(:progress) || 0
    end

    def failed?
      status == 'failed'
    end
  end
end
```

## Service Implementation

### 1. Base Processor Service

Following [Project Requirements](../project_requirements_document.md#core-features):

```ruby
# app/services/processing/base_processor.rb
module Processing
  class BaseProcessor
    include Processing::Types

    attr_reader :record

    def initialize(record)
      @record = record
    end

    def process
      validate_input
      initialize_steps
      process_steps
      finalize
    rescue ProcessingError => e
      handle_error(e)
    end

    private

    def validate_input
      raise NotImplementedError
    end

    def initialize_steps
      raise NotImplementedError
    end

    def process_steps
      record.steps.each do |step|
        process_step(step)
      end
    end

    def process_step(step)
      raise NotImplementedError
    end

    def finalize
      raise NotImplementedError
    end

    def handle_error(error)
      record.update!(
        status: 'failed',
        error_details: {
          message: error.message,
          backtrace: error.backtrace
        }
      )
    end
  end
end
```

### 2. Processing Strategy

Based on [System Prompts](../system_prompts_document.md) for AI integration:

```ruby
# app/services/strategies/base_strategy.rb
module Strategies
  class BaseStrategy
    include Processing::Types

    def process(input)
      raise NotImplementedError
    end

    def validate(input)
      raise NotImplementedError
    end

    def combine(results)
      raise NotImplementedError
    end
  end
end
```

## Background Jobs

Following [Tech Stack](../tech_stack_document.md#performance-optimization):

```ruby
# app/jobs/processing_job.rb
class ProcessingJob < ApplicationJob
  queue_as :processing

  def perform(record_id)
    record = Processing::Base.find(record_id)
    processor = "Processing::#{record.format.classify}Processor".constantize.new(record)
    processor.process
  rescue => e
    record.update!(
      status: 'failed',
      error_details: {
        message: e.message,
        backtrace: e.backtrace
      }
    )
    raise e
  end
end
```

## Error Handling

Based on [Frontend Guidelines](../frontend_guidelines_document.md#error-handling):

```ruby
# lib/processing/errors.rb
module Processing
  class Error < StandardError
    attr_reader :details

    def initialize(message, details = {})
      @details = details
      super(message)
    end
  end

  class ValidationError < Error; end
  class ProcessingError < Error; end
  class AdapterError < Error; end
end
```

## Documentation Requirements

When updating this documentation:

1. Reference [Project Requirements](../project_requirements_document.md)
2. Follow [Backend Structure](../backend_structure_document.md)
3. Align with [Tech Stack](../tech_stack_document.md)
4. Consider [System Prompts](../system_prompts_document.md)
5. Update [Frontend Guidelines](../frontend_guidelines_document.md) if needed

## Migration Steps

1. Database Setup:

   ```bash
   rails generate migration CreateProcessingTables
   rails db:migrate
   ```

2. Models and Services:

   ```bash
   # Generate models
   rails generate model Processing::Base
   rails generate model Processing::Step

   # Generate services
   rails generate service Processing::BaseProcessor
   rails generate service Processing::PodcastProcessor
   rails generate service Processing::SocialPostProcessor
   ```

3. Background Jobs:

   ```bash
   rails generate job Processing
   ```

4. Testing:
   ```bash
   # Generate test files
   rails generate rspec:model Processing::Base
   rails generate rspec:model Processing::Step
   rails generate rspec:service Processing::BaseProcessor
   ```

## Testing Strategy

```ruby
# spec/services/processing/base_processor_spec.rb
RSpec.describe Processing::BaseProcessor do
  let(:record) { create(:processing_record) }
  subject { described_class.new(record) }

  describe '#process' do
    context 'when successful' do
      it 'processes all steps' do
        expect { subject.process }.to change { record.reload.status }.from('pending').to('completed')
      end
    end

    context 'when failed' do
      it 'handles errors appropriately' do
        allow(subject).to receive(:process_steps).and_raise(Processing::ProcessingError)
        expect { subject.process }.to change { record.reload.status }.from('pending').to('failed')
      end
    end
  end
end
```

## Validation Checklist

- [ ] Database migrations created and tested
- [ ] Models implemented with validations
- [ ] Services implemented and tested
- [ ] Background jobs configured
- [ ] Error handling tested
- [ ] Monitoring set up
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
   Sidekiq::Queue.new('processing').clear
   ```

## Monitoring

1. Add processing metrics:

   ```ruby
   # config/initializers/metrics.rb
   PROCESSING_METRICS = [
     'processing.started',
     'processing.completed',
     'processing.failed',
     'processing.duration'
   ].freeze
   ```

2. Track performance:
   ```ruby
   ActiveSupport::Notifications.instrument(
     'processing.completed',
     format: record.format,
     duration: Time.current - start_time
   )
   ```

## Core Processing Migration Specifications

### 5. Type System Requirements

**Current TypeScript Foundations** ([source](../features/core-processing/architecture.md#type-system-architecture)):

- `ProcessingResult` with format-specific extensions
- Strict null checks and type guards
- Internal/public API type separation
- Entity types with validation schemas

**Migration Requirements:**

- Maintain equivalent type safety
- Preserve format-specific type extensions
- Replicate type-driven error handling
- Keep internal/public type separation

### 6. Validation Requirements

**Current Zod Implementation** ([source](../features/core-processing/validation.md)):

- Entity schema validation
- Minimum array length checks
- Non-empty string constraints
- Batch validation operations

**Migration Requirements:**

- Equivalent input validation rigor
- Parallel error messaging structure
- Matching validation test coverage
- Identical entity requirements

### 7. API Contract

**Current Endpoint Behavior** ([source](../features/core-processing/api.md)):

- POST /api/process/[format]
- Processing options payload
- JSON response with:
  - Status field
  - Progress percentage
  - Error details object
  - Analysis metadata

**Migration Requirements:**

- Maintain identical endpoint contracts
- Preserve response structure
- Match error status codes
- Keep analysis metadata format

### 8. Error Handling Standards

**Current Patterns** ([source](../features/core-processing/architecture.md#error-handling)):

- Custom error classes with codes
- Centralized error logging
- Type-safe error propagation
- Contextual error metadata

**Migration Requirements:**

- Equivalent error classification
- Same error code taxonomy
- Identical logging structure
- Matching error recovery flows

### 9. Monitoring Essentials

**Current Metrics** ([source](../features/core-processing/testing.md#monitoring-and-logging)):

- Step duration tracking
- Error rate thresholds
- Progress milestones
- Memory/CPU utilization

**Migration Requirements:**

- Replicate metric collection
- Maintain same thresholds
- Preserve alerting levels
- Keep dashboard groupings

## Migration Verification Checklist

- [ ] Type hierarchy matches [architecture docs](../features/core-processing/architecture.md)
- [ ] Validation rules match [validation specs](../features/core-processing/validation.md)
- [ ] API endpoints comply with [API documentation](../features/core-processing/api.md)
- [ ] Error handling replicates [defined patterns](../features/core-processing/testing.md#error-handling)
- [ ] Monitoring meets [defined observability standards](../features/core-processing/testing.md#monitoring-and-logging)
- [ ] All [core processing components](../features/core-processing/components.md) have migration parity
