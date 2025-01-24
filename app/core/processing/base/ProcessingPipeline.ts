import type {
  ProcessingChunk,
  ProcessingState,
  ProcessingStep,
  ProcessingResult,
  ProcessingAdapter,
} from "@/app/types/processing/base";
import { logger } from "@/lib/logger";
import { ChunkingStrategy } from "./ChunkingStrategy";
import { ProcessingStrategy } from "./ProcessingStrategy";
import { ProcessingError } from "../errors/ProcessingError";
import { PROCESSING_CONFIG } from "../config/processingConfig";

const isValidResult = <T>(result: T | null): result is T => {
  return result !== null;
};

export class ProcessingPipeline<TInput, TChunk, TOutput> {
  private chunks: TChunk[] = [];
  private results: TOutput[] = [];
  private processingStrategy: ProcessingStrategy<TChunk, TOutput>;
  private chunkingStrategy: ChunkingStrategy<TInput, TChunk>;

  constructor(
    strategy: ProcessingStrategy<TChunk, TOutput>,
    chunkingStrategy: ChunkingStrategy<TInput, TChunk>
  ) {
    this.processingStrategy = strategy;
    this.chunkingStrategy = chunkingStrategy;
  }

  getChunks(): TChunk[] {
    return this.chunks;
  }

  getResults(): TOutput[] {
    return this.results;
  }

  async process(input: TInput): Promise<TOutput> {
    try {
      // Step 1: Chunk the input
      await this.processVoidStep("chunk", async () => {
        this.chunks = this.chunkingStrategy.chunk(input);
        if (
          !this.chunks.every((chunk) => this.chunkingStrategy.validate(chunk))
        ) {
          throw new ProcessingError(
            "Invalid chunks generated",
            "INVALID_CHUNKS_ERROR"
          );
        }
      });

      // Step 2: Process chunks
      await this.processVoidStep("process", async () => {
        this.results = await this.processChunksInBatches(this.chunks);
      });

      // Step 3: Combine results
      return await this.processOutputStep("combine", async () => {
        return this.combineResults(this.results);
      });
    } catch (error) {
      throw new ProcessingError(
        "Pipeline processing failed",
        "PIPELINE_ERROR",
        undefined,
        { error }
      );
    }
  }

  private async processVoidStep(
    stepId: string,
    executor: () => Promise<void>
  ): Promise<void> {
    try {
      logger.debug(`Starting step: ${stepId}`);
      await executor();
      logger.debug(`Completed step: ${stepId}`);
    } catch (error) {
      logger.error(`Failed step: ${stepId}`, { error });
      throw new ProcessingError(
        `Step ${stepId} failed`,
        "STEP_EXECUTION_ERROR",
        stepId,
        { error }
      );
    }
  }

  private async processOutputStep(
    stepId: string,
    executor: () => Promise<TOutput>
  ): Promise<TOutput> {
    try {
      logger.debug(`Starting step: ${stepId}`);
      const result = await executor();
      logger.debug(`Completed step: ${stepId}`);
      return result;
    } catch (error) {
      logger.error(`Failed step: ${stepId}`, { error });
      throw new ProcessingError(
        `Step ${stepId} failed`,
        "STEP_EXECUTION_ERROR",
        stepId,
        { error }
      );
    }
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
          logger.debug(`Processing batch item ${i + index}`);
          const result = await this.processingStrategy.process(chunk);
          return result;
        } catch (error) {
          logger.error(`Failed to process batch item ${i + index}`, { error });
          errors.push(error as Error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      const validResults = batchResults.filter(isValidResult);
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
}
