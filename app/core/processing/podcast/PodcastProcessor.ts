import { Processor } from "../base/Processor";
import type { ProcessingResult, TextChunk, ChunkResult } from "../types";
import { PodcastChunker } from "../podcast";
import { PodcastProcessingStrategy } from "./PodcastProcessingStrategy";
import { ProcessingLogger } from "../utils/logger";

export class PodcastProcessor extends Processor<string, ProcessingResult> {
  private chunker: PodcastChunker;
  private strategy: PodcastProcessingStrategy;

  constructor() {
    super();
    this.chunker = new PodcastChunker();
    this.strategy = new PodcastProcessingStrategy();
  }

  async process(input: string): Promise<ProcessingResult> {
    try {
      // Split input into manageable chunks
      const chunks = await this.chunker.chunk(input);

      // Process each chunk using our strategy
      const results = await Promise.all(
        chunks.map(async (chunk) => {
          if (!this.strategy.validate(chunk)) {
            throw new Error(`Invalid chunk: ${chunk.id}`);
          }
          return this.strategy.process(chunk);
        })
      );

      // Combine the chunk results
      const combinedResult = await this.strategy.combine(results);

      // Transform ChunkResult into ProcessingResult
      return {
        transcript: input,
        refinedTranscript: combinedResult.refinedText,
        analysis: combinedResult.analysis,
        entities: combinedResult.entities,
        timeline: combinedResult.timeline,
      };
    } catch (error) {
      ProcessingLogger.log("error", "Failed to process podcast", { error });
      throw error;
    }
  }

  validateInput(input: string): boolean {
    return typeof input === "string" && input.length > 0;
  }

  validateOutput(output: ProcessingResult): boolean {
    return (
      output.transcript !== undefined &&
      output.analysis !== undefined &&
      output.entities !== undefined &&
      output.timeline !== undefined
    );
  }
}
