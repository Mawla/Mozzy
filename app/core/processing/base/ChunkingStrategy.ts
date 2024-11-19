export interface ChunkingStrategy<TInput, TChunk> {
  chunk(content: TInput, options?: ChunkOptions): TChunk[];
  validate(chunk: TChunk): boolean;
}

export interface ChunkOptions {
  maxSize?: number;
  overlap?: number;
  delimiter?: string;
  preserveDelimiter?: boolean;
}
