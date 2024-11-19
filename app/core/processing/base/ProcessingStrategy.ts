export interface ProcessingStrategy<TChunk, TOutput> {
  process(input: TChunk): Promise<TOutput>;
  validate(input: TChunk): boolean;
  combine(results: TOutput[]): TOutput;

  // Add optional step-specific methods
  processAnalysis?(chunks: TChunk[]): Promise<any>;
  processEntities?(chunks: TChunk[]): Promise<any>;
  processTimeline?(chunks: TChunk[]): Promise<any>;
}
