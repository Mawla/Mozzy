import { ChunkingStrategy } from "./ChunkingStrategy";
import { ProcessingStrategy } from "./ProcessingStrategy";
import { ProcessingError } from "../errors/ProcessingError";
import { ProcessingLogger } from "../utils/logger";
import { PROCESSING_CONFIG } from "../config/processingConfig";

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
      throw new Error("Invalid chunks generated");
    }

    // 3. Process chunks in parallel with batching
    this.results = await this.processChunksInBatches(this.chunks);

    // 4. Combine results
    return this.processingStrategy.combine(this.results);
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
          return await this.processingStrategy.process(chunk);
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
      const validResults = batchResults.filter(
        (result): result is Awaited<TOutput> => result !== null
      );
      results.push(...validResults);

      // If all chunks in batch failed, throw error
      if (validResults.length === 0 && errors.length > 0) {
        throw new ProcessingError(
          "Batch processing failed",
          "BATCH_PROCESSING_ERROR",
          { errors }
        );
      }
    }

    return results;
  }

  async processStep(stepId: string): Promise<any> {
    switch (stepId) {
      case "analysis":
        return this.processingStrategy.processAnalysis?.(this.chunks);
      case "entities":
        return this.processingStrategy.processEntities?.(this.chunks);
      case "timeline":
        return this.processingStrategy.processTimeline?.(this.chunks);
      default:
        throw new Error(`Unknown step: ${stepId}`);
    }
  }
}
