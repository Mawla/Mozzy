# Core Processing API Documentation

## Overview

The Core Processing API provides a unified interface for processing different types of content through format-specific adapters. This document outlines the available interfaces, types, and usage patterns.

## Key Features

- Format-agnostic processing interface
- Type-safe adapter registration
- Consistent error handling
- Status tracking
- Format-specific processing options

## Core Types

### ProcessingFormat

```typescript
export type ProcessingFormat = "podcast" | "post";
```

Supported content formats for processing.

### ProcessingQuality

```typescript
export type ProcessingQuality = "draft" | "final";
```

Quality level for content processing.

### ProcessingStatus

```typescript
export type ProcessingStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";
```

Status of a processing operation.

### ProcessingOptions

```typescript
export interface ProcessingOptions {
  format: ProcessingFormat;
  quality: ProcessingQuality;
  analyzeSentiment?: boolean;
  extractEntities?: boolean;
  includeTimestamps?: boolean;
}
```

Options for content processing.

### ProcessingResult

```typescript
export interface ProcessingResult {
  id: string;
  status: ProcessingStatus;
  output: string;
  error?: string;
  metadata: ProcessingMetadata;
  analysis?: ProcessingAnalysis;
}
```

Result of a processing operation.

### ProcessingMetadata

```typescript
export interface ProcessingMetadata {
  format: ProcessingFormat;
  platform: string;
  processedAt: string;
  title?: string;
  duration?: string;
  speakers?: string[];
  topics?: string[];
}
```

Metadata associated with processed content.

### ProcessingAnalysis

```typescript
export interface ProcessingAnalysis {
  entities?: {
    people: string[];
    organizations: string[];
    locations: string[];
    concepts: string[];
  };
  timeline?: TimelineEvent[];
  sentiment?: {
    overall: number;
    segments: Array<{
      text: string;
      score: number;
    }>;
  };
}
```

Analysis results from content processing.

## Core Interfaces

### ProcessingAdapter

```typescript
export interface ProcessingAdapter {
  validate: (input: string) => Promise<boolean>;
  process: (
    input: string,
    options: ProcessingOptions
  ) => Promise<ProcessingResult>;
  getStatus: (id: string) => Promise<ProcessingResult>;
}
```

Interface that all format-specific adapters must implement.

## ProcessingService

The main service for managing content processing.

### Constructor

```typescript
class ProcessingService {
  constructor();
}
```

Creates a new ProcessingService instance.

### Methods

#### registerAdapter

```typescript
registerAdapter(format: ProcessingFormat, adapter: ProcessingAdapter): void
```

Registers a format-specific adapter.

**Parameters:**

- `format`: The content format this adapter handles
- `adapter`: The adapter implementation

**Example:**

```typescript
const service = new ProcessingService();
service.registerAdapter("podcast", new PodcastProcessingAdapter());
service.registerAdapter("post", new PostProcessingAdapter());
```

#### process

```typescript
async process(
  format: ProcessingFormat,
  input: string,
  options: ProcessingOptions
): Promise<ProcessingResult>
```

Processes content using the appropriate adapter.

**Parameters:**

- `format`: The content format to process
- `input`: The content to process
- `options`: Processing options

**Example:**

```typescript
const result = await service.process("podcast", content, {
  format: "podcast",
  quality: "draft",
  analyzeSentiment: true,
  extractEntities: true,
});
```

#### getStatus

```typescript
async getStatus(
  format: ProcessingFormat,
  id: string
): Promise<ProcessingResult>
```

Gets the status of a processing operation.

**Parameters:**

- `format`: The content format
- `id`: The processing operation ID

**Example:**

```typescript
const status = await service.getStatus("podcast", "process-123");
```

## Error Handling

The API uses a consistent error handling pattern:

1. Validation Errors

   ```typescript
   // Invalid input
   {
     status: "failed",
     error: "Invalid input",
     ...
   }
   ```

2. Processing Errors

   ```typescript
   // Processing failure
   {
     status: "failed",
     error: "Processing failed: reason",
     ...
   }
   ```

3. Adapter Errors
   ```typescript
   // No adapter available
   Error: "No adapter registered for format: format";
   ```

## Security Considerations

1. Input Validation

   - All input is validated before processing
   - Size limits are enforced
   - Format verification is performed

2. Error Messages

   - No sensitive data in errors
   - Sanitized error messages
   - Safe error propagation

3. Resource Protection
   - Timeout enforcement
   - Memory limits
   - Processing quotas
