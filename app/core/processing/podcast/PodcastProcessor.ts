import { Processor } from "../base/Processor";
import type { ProcessingResult, TextChunk, ChunkResult } from "../types";
import { PodcastChunker } from "../podcast";
import { combineChunkResults } from "../../utils/processing";
import { refinePodcastTranscript } from "@/app/actions/anthropicActions";
import { PodcastProcessingStrategy } from "./PodcastProcessingStrategy";
import { ProcessingLogger } from "../utils/logger";

export class PodcastProcessor extends Processor<string, ProcessingResult> {
  private chunker: PodcastChunker;

  constructor() {
    super();
    this.chunker = new PodcastChunker();
  }

  async process(input: string): Promise<ProcessingResult> {
    const chunks = await this.chunker.chunk(input);
    const processedChunks = await this.processChunks(chunks);
    return combineChunkResults(processedChunks);
  }

  private async processChunks(chunks: TextChunk[]): Promise<ChunkResult[]> {
    const strategy = new PodcastProcessingStrategy();
    const results: ChunkResult[] = [];

    for (const chunk of chunks) {
      if (!strategy.validate(chunk)) {
        throw new Error(`Invalid chunk: ${chunk.id}`);
      }

      try {
        const result = await strategy.process(chunk);
        results.push(result);
      } catch (error) {
        ProcessingLogger.log("error", `Failed to process chunk: ${chunk.id}`, {
          error,
        });
        throw error;
      }
    }

    return results;
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
