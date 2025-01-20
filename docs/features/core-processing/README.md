# Core Processing System

### 2025-01-20 07:28 - Type System Update

The core processing system is undergoing a type system restructuring to improve type safety and error handling.
See type-system-restructure-20250119/.plan for details.

## Recent Updates

- Improved error handling with strongly typed logger integration
- Consolidated type system with clear hierarchy
- Added internal/public API separation for processing types
- Enhanced error recovery and reporting

## Overview

The core processing system is responsible for transforming content between different formats while maintaining semantic meaning and structure. It supports:

- Podcast processing (audio to text, transcription, analysis)
- Post processing (text adaptation, platform optimization)
- Entity extraction and analysis
- Timeline generation
- Sentiment analysis

## Key Features

1. Type-Safe Processing

   ```typescript
   // Format-specific processing options
   interface PodcastProcessingOptions {
     extractSpeakers: boolean;
     generateTimeline: boolean;
     speakerDiarization: boolean;
     transcriptionQuality: "standard" | "premium";
   }

   // Strongly typed results
   interface PodcastProcessingResult {
     format: "podcast";
     analysis: PodcastAnalysis;
     chunks: PodcastTextChunk[];
     speakers: string[];
     timeline: TimelineEvent[];
     entities: {
       people: PersonEntity[];
       organizations: OrganizationEntity[];
       locations: LocationEntity[];
       events: EventEntity[];
     };
   }
   ```

2. Error Handling

   ```typescript
   try {
     const result = await processor.process(input, options);
   } catch (err) {
     const error = err instanceof Error ? err : new Error(String(err));
     logger.error("Processing failed", error, { context: options });
     return createErrorResult(error.message);
   }
   ```

3. Modular Architecture

   - Format-specific adapters
   - Pluggable processing strategies
   - Extensible type system
   - Centralized error handling

## Purpose and Goals

- Provide a unified interface for content processing
- Support multiple content formats through adapters
- Handle validation, processing, and error states consistently
- Enable format-specific processing features when needed
- Maintain type safety and clear interfaces

## Type System

### Base Types

All core types are defined in `app/core/processing/types/base.ts`:

```typescript
// Core processing types
export type ProcessingFormat = "podcast" | "post";
export type ProcessingQuality = "draft" | "final";
export type ProcessingStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "error";

// Base interfaces
export interface ProcessingState {
  status: ProcessingStatus;
  error?: Error;
  overallProgress: number;
  steps: ProcessingStep[];
  chunks: BaseTextChunk[];
  networkLogs: NetworkLog[];
  currentTranscript: string;
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: ProcessingStatus;
  progress: number;
  error?: Error;
  description?: string;
  data?: any;
  chunks?: BaseTextChunk[];
  networkLogs?: NetworkLog[];
}
```

### Format-Specific Types

Format-specific types extend the base types:

```typescript
// Podcast-specific types
export interface PodcastAnalysis extends ProcessingAnalysis {
  sections?: Section[];
  themes?: string[];
}

export interface ProcessingResult extends BaseProcessingResult {
  refinedTranscript: string;
  analysis: PodcastAnalysis;
  entities: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  timeline: TimelineEvent[];
}
```

## Processing Strategy

The `ProcessingStrategy` abstract class defines the core processing interface:

```typescript
export abstract class ProcessingStrategy {
  protected state: ProcessingState;

  protected abstract initializeSteps(): void;
  protected abstract validateInput(input: string): Promise<boolean>;
  protected abstract processStep(stepId: string): Promise<void>;
  protected abstract validateDependencies(stepId: string): boolean;
  protected abstract handleStepError(stepId: string, error: Error): void;
  protected abstract cleanup(): void;

  public abstract process(chunk: string): Promise<void>;
  public abstract validate(input: string): boolean;
  public abstract combine?(results: string[]): Promise<string>;
}
```

## Error Handling

The system uses type-safe error handling throughout:

```typescript
try {
  const result = JSON.parse(input) as ProcessingResult;
} catch (error) {
  logger.error(
    "Failed to parse result:",
    error instanceof Error ? error : new Error(String(error))
  );
}
```

## Usage

```typescript
// Initialize processing service
const processingService = new ProcessingService();

// Register format adapters
processingService.registerAdapter("podcast", new PodcastProcessingAdapter());
processingService.registerAdapter("post", new PostProcessingAdapter());

// Process content
const result = await processingService.process(input, {
  format: "podcast",
  quality: "final",
});
```

## Dependencies

- TypeScript for type safety
- Jest for testing
- Podcast feature for podcast-specific processing
- Posts feature for post-specific processing

## Status

### Current State

- Core processing structure implemented
- Adapter pattern in place
- Unit tests complete
- Integration with podcast and post features

### Known Limitations

- Limited to text-based content
- No streaming support yet
- Basic sentiment analysis

### Planned Improvements

- Add more content formats
- Enhance error handling
- Improve performance
- Add more analysis options

## Quick Links

- [Architecture](./architecture.md)
- [Components](./components.md)
- [API Documentation](./api.md)
- [Testing](./testing.md)
