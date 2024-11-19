export interface ProcessingStrategy<TInput, TOutput> {
  process(input: TInput): Promise<TOutput>;
  validate(input: TInput): boolean;
  combine(results: TOutput[]): TOutput;
}
