import {
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingResult,
  ProcessingFormat,
} from "../types";

export class ProcessingService {
  private adapters: Map<ProcessingFormat, ProcessingAdapter>;

  constructor() {
    this.adapters = new Map();
  }

  registerAdapter(format: ProcessingFormat, adapter: ProcessingAdapter) {
    this.adapters.set(format, adapter);
  }

  private getAdapter(format: ProcessingFormat): ProcessingAdapter {
    const adapter = this.adapters.get(format);
    if (!adapter) {
      throw new Error(`No adapter registered for format: ${format}`);
    }
    return adapter;
  }

  async process(
    format: ProcessingFormat,
    input: string,
    options: ProcessingOptions
  ): Promise<ProcessingResult> {
    try {
      const adapter = this.getAdapter(format);

      // Validate input
      const isValid = await adapter.validate(input);
      if (!isValid) {
        throw new Error("Invalid input");
      }

      // Process content
      const result = await adapter.process(input, {
        ...options,
        format,
      });

      return result;
    } catch (error) {
      return {
        id: Math.random().toString(36).substring(7),
        status: "failed",
        output: "",
        error: error instanceof Error ? error.message : "Processing failed",
        metadata: {
          format,
          platform: "default",
          processedAt: new Date().toISOString(),
        },
      };
    }
  }

  async getStatus(
    format: ProcessingFormat,
    id: string
  ): Promise<ProcessingResult> {
    try {
      const adapter = this.getAdapter(format);
      return await adapter.getStatus(id);
    } catch (error) {
      throw error instanceof Error ? error : new Error("Status check failed");
    }
  }
}
