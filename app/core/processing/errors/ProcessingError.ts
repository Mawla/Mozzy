export class ProcessingError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly step?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ProcessingError";
  }
}

export class ChunkProcessingError extends ProcessingError {
  constructor(
    message: string,
    public readonly chunkIndex: number,
    details?: unknown
  ) {
    super(message, "CHUNK_PROCESSING_ERROR", undefined, details);
    this.name = "ChunkProcessingError";
  }
}

export class PipelineError extends ProcessingError {
  constructor(
    message: string,
    public readonly failedSteps: string[],
    details?: unknown
  ) {
    super(message, "PIPELINE_ERROR", undefined, details);
    this.name = "PipelineError";
  }
}

export class ValidationError extends ProcessingError {
  constructor(message: string, step?: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", step, details);
    this.name = "ValidationError";
  }
}
