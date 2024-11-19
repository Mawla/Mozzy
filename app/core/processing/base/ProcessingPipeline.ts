import { ChunkingStrategy } from "./ChunkingStrategy";
import { ProcessingStrategy } from "./ProcessingStrategy";

export class ProcessingPipeline<TInput, TChunk, TOutput> {
  constructor(
    private chunkingStrategy: ChunkingStrategy<TInput, TChunk>,
    private processingStrategy: ProcessingStrategy<TChunk, TOutput>
  ) {}

  async process(input: TInput): Promise<TOutput> {
    // 1. Chunk the input
    const chunks = this.chunkingStrategy.chunk(input);

    // 2. Validate chunks
    if (!chunks.every((chunk) => this.chunkingStrategy.validate(chunk))) {
      throw new Error("Invalid chunks generated");
    }

    // 3. Process chunks in parallel with batching
    const results = await this.processChunksInBatches(chunks);

    // 4. Combine results
    return this.processingStrategy.combine(results);
  }

  private async processChunksInBatches(
    chunks: TChunk[],
    batchSize = 3
  ): Promise<TOutput[]> {
    const results: TOutput[] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchPromises = batch.map((chunk) =>
        this.processingStrategy.process(chunk)
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }
}
