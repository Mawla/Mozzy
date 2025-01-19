# Core Processing

### 2025-01-19 17:00 - Type System Status Update

Current type system issues (200 errors in 59 files):

- Missing Type Exports (40%): Core processing types not exported
- Interface Mismatches (30%): ProcessingResult conflicts
- Type Definition Issues (20%): Implicit any types
- Import/Path Issues (10%): Path resolution problems

## Overview

The core processing system provides a unified interface for processing different content formats (podcast, post) through a common pipeline. It uses an adapter pattern to handle format-specific processing while maintaining a consistent interface.

## Purpose and Goals

- Provide a unified interface for content processing
- Support multiple content formats through adapters
- Handle validation, processing, and error states consistently
- Enable format-specific processing features when needed
- Maintain type safety and clear interfaces

## Key Features

- Unified processing interface via ProcessingService
- Format-specific adapters (podcast, post)
- Type-safe processing pipeline
- Comprehensive error handling
- Extensive test coverage

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
