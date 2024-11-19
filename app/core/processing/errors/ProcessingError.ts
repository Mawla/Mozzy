export class ProcessingError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = "ProcessingError";
  }
}

export class ChunkingError extends ProcessingError {
  constructor(message: string, details?: any) {
    super(message, "CHUNKING_ERROR", details);
    this.name = "ChunkingError";
  }
}

export class ProcessingStrategyError extends ProcessingError {
  constructor(message: string, details?: any) {
    super(message, "PROCESSING_STRATEGY_ERROR", details);
    this.name = "ProcessingStrategyError";
  }
}
