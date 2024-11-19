import { ChunkingStrategy } from "./ChunkingStrategy";
import { ProcessingStrategy } from "./ProcessingStrategy";
import { ProcessingError } from "../errors/ProcessingError";
import { ProcessingLogger } from "../utils/logger";
import { PROCESSING_CONFIG } from "../config/processingConfig";

// Move type guard outside of block
const isValidResult = <T>(result: T | null): result is T => {
  return result !== null;
};

export class ProcessingPipeline<TInput, TChunk, TOutput> {
  private chunks: TChunk[] = [];
  private results: TOutput[] = [];

  constructor(
    private chunkingStrategy: ChunkingStrategy<TInput, TChunk>,
    private processingStrategy: ProcessingStrategy<TChunk, TOutput>
  ) {}

  getChunks(): TChunk[] {
    return this.chunks;
  }

  getResults(): TOutput[] {
    return this.results;
  }

  async process(input: TInput): Promise<TOutput> {
    // 1. Chunk the input
    this.chunks = this.chunkingStrategy.chunk(input);

    // 2. Validate chunks
    if (!this.chunks.every((chunk) => this.chunkingStrategy.validate(chunk))) {
      throw new ProcessingError(
        "Invalid chunks generated",
        "INVALID_CHUNKS_ERROR"
      );
    }

    // 3. Process chunks in parallel with batching
    this.results = await this.processChunksInBatches(this.chunks);

    // 4. Combine results
    return this.combineResults(this.results);
  }

  private async processChunksInBatches(
    chunks: TChunk[],
    batchSize = PROCESSING_CONFIG.processing.batchSize
  ): Promise<TOutput[]> {
    const results: TOutput[] = [];
    const errors: Error[] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchPromises = batch.map(async (chunk, index) => {
        try {
          ProcessingLogger.log("debug", `Processing batch item ${i + index}`);
          const result = await this.processingStrategy.process(chunk);
          return result;
        } catch (error) {
          ProcessingLogger.log(
            "error",
            `Failed to process batch item ${i + index}`,
            { error }
          );
          errors.push(error as Error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      const validResults = batchResults.filter(isValidResult);

      // Type assertion to ensure type compatibility
      results.push(...(validResults as TOutput[]));

      if (validResults.length === 0 && errors.length > 0) {
        throw new ProcessingError(
          "Batch processing failed",
          "BATCH_PROCESSING_ERROR",
          undefined,
          { errors }
        );
      }
    }

    return results;
  }

  private async combineResults(results: TOutput[]): Promise<TOutput> {
    if (results.length === 0) {
      throw new ProcessingError("No results to combine", "NO_RESULTS_ERROR");
    }

    if (results.length === 1) {
      return results[0];
    }

    if (this.processingStrategy.combine) {
      return await this.processingStrategy.combine(results);
    }

    throw new ProcessingError(
      "Combine method not implemented in strategy",
      "COMBINE_NOT_IMPLEMENTED"
    );
  }

  async processStep(stepId: string): Promise<void> {
    const stepMethod = `process${stepId.charAt(0).toUpperCase()}${stepId.slice(
      1
    )}`;

    // Use type assertion with unknown first
    const strategy = this.processingStrategy as unknown;
    const typedStrategy = strategy as { [key: string]: unknown };

    if (typeof typedStrategy[stepMethod] === "function") {
      const processFunction = typedStrategy[stepMethod] as (
        chunks: TChunk[]
      ) => Promise<void>;
      await processFunction(this.chunks);
    } else {
      throw new ProcessingError(
        `Step ${stepId} not implemented`,
        "STEP_NOT_IMPLEMENTED",
        stepId
      );
    }
  }
}
