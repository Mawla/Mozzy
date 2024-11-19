import { ProcessingPipeline } from "../base/ProcessingPipeline";
import { TextChunkingStrategy } from "../strategies/TextChunkingStrategy";
import { PodcastProcessingStrategy } from "../podcast/PodcastProcessingStrategy";
import type { TextChunk, ChunkResult } from "../types";

export class PipelineFactory {
  static createPodcastPipeline(): ProcessingPipeline<
    string,
    TextChunk,
    ChunkResult
  > {
    const chunkingStrategy = new TextChunkingStrategy();
    const processingStrategy = new PodcastProcessingStrategy();

    return new ProcessingPipeline(chunkingStrategy, processingStrategy);
  }
}
