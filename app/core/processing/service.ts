import {
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingResult,
} from "./types";

export class ProcessingService {
  private adapter: ProcessingAdapter;

  constructor(adapter: ProcessingAdapter) {
    this.adapter = adapter;
  }

  async process(
    input: string,
    options: ProcessingOptions
  ): Promise<ProcessingResult> {
    const isValid = await this.adapter.validate(input);
    if (!isValid) {
      throw new Error("Invalid input for processing");
    }

    return this.adapter.process(input, options);
  }

  async getStatus(id: string): Promise<ProcessingResult> {
    return this.adapter.getStatus(id);
  }
}
