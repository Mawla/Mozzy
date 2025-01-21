# Processing Types

Last Updated: 2025-01-21 13:16

## Overview

Processing types define the structure and flow of content transformation in the Mozzy platform. They handle everything from initial content ingestion to final output generation.

## Parallel Processing

### Parallel Pipeline Configuration

```typescript
interface ParallelProcessingConfig {
  maxConcurrent: number;
  timeoutMs: number;
  retryStrategy: RetryStrategy;
  priorityQueue: boolean;
}

interface RetryStrategy {
  maxAttempts: number;
  backoffMs: number;
  maxBackoffMs: number;
}
```

### Batch Processing

```typescript
interface BatchProcessingJob<T extends BaseEntity> {
  id: string;
  entities: T[];
  config: ParallelProcessingConfig;
  status: BatchStatus;
  progress: BatchProgress;
}

interface BatchProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
}
```

### Error Recovery

1. Automatic Retry:

```typescript
interface RetryableError extends ProcessingError {
  attemptCount: number;
  lastAttempt: string;
  nextAttempt?: string;
}

function isRetryableError(error: ProcessingError): error is RetryableError {
  return "attemptCount" in error && error.recoverable;
}
```

2. Manual Recovery:

```typescript
interface RecoveryAction {
  type: "RETRY" | "SKIP" | "ABORT";
  metadata?: Record<string, unknown>;
}

async function recoverStep<T extends BaseEntity>(
  step: ProcessingStep<T>,
  action: RecoveryAction
): Promise<ProcessingStep<T>> {
  // Recovery implementation
}
```

## Core Processing Types

### Processing Step

The fundamental unit of content processing:

```typescript
interface ProcessingStep<T extends BaseEntity> {
  id: string;
  type: ProcessingStepType;
  status: ProcessingStatus;
  entity: T;
  metadata: ProcessingMetadata;
  startedAt?: string;
  completedAt?: string;
  error?: ProcessingError;
}

type ProcessingStepType =
  | "TRANSCRIPTION"
  | "CHUNKING"
  | "ANALYSIS"
  | "TRANSFORMATION"
  | "OPTIMIZATION";

type ProcessingStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";
```

### Processing Pipeline

Manages the flow of processing steps:

```typescript
interface ProcessingPipeline<T extends BaseEntity> {
  id: string;
  entity: T;
  steps: ProcessingStep<T>[];
  status: ProcessingStatus;
  metadata: PipelineMetadata;
  createdAt: string;
  updatedAt: string;
}

interface PipelineMetadata {
  totalSteps: number;
  currentStep: number;
  estimatedTimeRemaining?: number;
  processingMode: "SEQUENTIAL" | "PARALLEL";
}
```

## Specialized Processing Types

### Podcast Processing

```typescript
interface PodcastProcessingStep extends ProcessingStep<PodcastEntity> {
  metadata: PodcastProcessingMetadata;
}

interface PodcastProcessingMetadata {
  audioQuality?: AudioQualityMetrics;
  transcriptionConfidence?: number;
  speakerCount?: number;
  segmentCount?: number;
}
```

### Post Processing

```typescript
interface PostProcessingStep extends ProcessingStep<PostEntity> {
  metadata: PostProcessingMetadata;
}

interface PostProcessingMetadata {
  wordCount?: number;
  readingTime?: number;
  contentScore?: number;
  targetPlatform?: string;
}
```

## Processing Results

### Analysis Results

```typescript
interface ProcessingAnalysis {
  id: string;
  type: AnalysisType;
  results: AnalysisResults;
  confidence: number;
  timestamp: string;
}

interface AnalysisResults {
  keyPoints: KeyPoint[];
  entities: Entity[];
  sentiment: SentimentAnalysis;
  topics: Topic[];
}
```

### Transformation Results

```typescript
interface TransformationResult<T extends BaseEntity> {
  id: string;
  originalEntity: T;
  transformedEntity: T;
  transformationType: TransformationType;
  changes: EntityChanges[];
  metadata: TransformationMetadata;
}
```

## Usage Guidelines

### Creating Processing Steps

```typescript
import { createProcessingStep } from "@/utils/processing";

const step = createProcessingStep<PodcastEntity>({
  type: "TRANSCRIPTION",
  entity: podcast,
  metadata: {
    audioQuality: { bitrate: 128, channels: 2 },
  },
});
```

### Managing Pipelines

```typescript
import { createPipeline, addStep, updateStepStatus } from "@/utils/processing";

const pipeline = createPipeline<PodcastEntity>({
  entity: podcast,
  metadata: {
    processingMode: "SEQUENTIAL",
  },
});

const updatedPipeline = addStep(pipeline, transcriptionStep);
```

## Error Handling

```typescript
interface ProcessingError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  recoverable: boolean;
}

function handleProcessingError(error: ProcessingError) {
  if (error.recoverable) {
    // Implement retry logic
  } else {
    // Handle fatal error
  }
}
```

## Best Practices

1. Pipeline Design:

   - Keep steps atomic and focused
   - Handle errors gracefully
   - Implement retry mechanisms
   - Monitor progress accurately

2. Performance:

   - Use appropriate processing mode
   - Implement timeouts
   - Handle resource cleanup
   - Cache intermediate results

3. Type Safety:
   - Use generics consistently
   - Implement type guards
   - Validate step transitions
   - Handle edge cases

## Common Patterns

### Step Transitions

```typescript
function transitionStep<T extends BaseEntity>(
  step: ProcessingStep<T>,
  newStatus: ProcessingStatus
): ProcessingStep<T> {
  return {
    ...step,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    ...(newStatus === "COMPLETED" && {
      completedAt: new Date().toISOString(),
    }),
  };
}
```

### Progress Tracking

```typescript
interface ProgressTracker {
  totalSteps: number;
  completedSteps: number;
  currentStep?: ProcessingStep<any>;
  estimatedTimeRemaining?: number;

  updateProgress(step: ProcessingStep<any>): void;
  getProgress(): number;
  getEstimatedCompletion(): Date;
}
```

## Integration Examples

### Component Integration

```typescript
function ProcessingPipeline<T extends BaseEntity>({
  pipeline,
  onStepComplete,
  onPipelineComplete,
}: ProcessingPipelineProps<T>) {
  // Implementation
}
```

### Service Integration

```typescript
class ProcessingService<T extends BaseEntity> {
  async startProcessing(entity: T): Promise<ProcessingPipeline<T>>;
  async getStatus(pipelineId: string): Promise<ProcessingStatus>;
  async cancelProcessing(pipelineId: string): Promise<void>;
}
```

## Related Documentation

- [Entity Types](../entities/README.md)
- [Type System Overview](../README.md)
- [Component Integration](../../components/README.md)
