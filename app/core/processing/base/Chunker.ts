export abstract class Chunker<TInput, TChunk> {
  abstract chunk(content: TInput, options?: any): TChunk[];
  abstract validateChunk(chunk: TChunk): boolean;
  abstract combineChunks(chunks: TChunk[]): TInput;

  protected async safeChunk(content: TInput, options?: any): Promise<TChunk[]> {
    const chunks = this.chunk(content, options);
    if (!chunks.every(this.validateChunk)) {
      throw new Error("Invalid chunks generated");
    }
    return chunks;
  }
}
