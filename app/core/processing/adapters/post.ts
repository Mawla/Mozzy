import {
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingResult,
} from "../types";
import { PodcastProcessor } from "../podcast/PodcastProcessor";
import { logger } from "@/lib/logger";

export class PostProcessingAdapter implements ProcessingAdapter {
  private processor: PodcastProcessor;

  constructor() {
    this.processor = new PodcastProcessor();
  }

  async validate(input: string | any): Promise<boolean> {
    if (!input) {
      return false;
    }

    try {
      const content = String(input);
      return this.processor.validateInput(content);
    } catch (error) {
      logger.error(
        "Validation error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  async process(
    input: string,
    options: ProcessingOptions
  ): Promise<ProcessingResult> {
    const id = crypto.randomUUID();

    // Validate input first
    const isValid = await this.validate(input);
    if (!isValid) {
      return {
        id,
        status: "failed",
        output: "",
        error: "Invalid input for processing",
        metadata: {
          format: "post",
          platform: options.targetPlatform || "default",
          processedAt: new Date().toISOString(),
        },
      };
    }

    try {
      // Use the core processor to process the content
      const result = await this.processor.process(input);

      // Just override the format in metadata
      return {
        ...result,
        metadata: {
          ...result.metadata,
          format: "post",
          platform: options.targetPlatform || "default",
        },
      };
    } catch (error) {
      logger.error(
        "Processing error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        id,
        status: "failed",
        output: "",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        metadata: {
          format: "post",
          platform: options.targetPlatform || "default",
          processedAt: new Date().toISOString(),
        },
      };
    }
  }

  async getStatus(id: string): Promise<ProcessingResult> {
    // In a real implementation, this would check a database or queue
    return {
      id,
      status: "completed",
      output: "",
      metadata: {
        format: "post",
        platform: "default",
        processedAt: new Date().toISOString(),
      },
    };
  }
}
