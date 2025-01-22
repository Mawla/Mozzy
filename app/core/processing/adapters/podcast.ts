import {
  ProcessingAdapter,
  ProcessingOptions,
  BaseProcessingResult,
  ProcessingStatus,
  ProcessingAnalysis,
  ProcessingMetadata,
} from "@/app/types/processing/base";

import { PodcastProcessor } from "../podcast/PodcastProcessor";
import { logger } from "@/lib/logger";
import { ProcessingResult as PodcastResult } from "@/app/types/podcast/processing";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const generateId = () => uuidv4();

export class PodcastProcessingAdapter implements ProcessingAdapter {
  constructor(private processor: PodcastProcessor) {}

  async validate(input: string): Promise<boolean> {
    try {
      // Basic validation - check if input is not empty
      return input.trim().length > 0;
    } catch (error) {
      return false;
    }
  }

  async process(
    input: string,
    options: ProcessingOptions
  ): Promise<BaseProcessingResult> {
    try {
      const isValid = await this.validate(input);
      if (!isValid) {
        return this.createErrorResult("Invalid input");
      }

      const result = await this.processor.process(input);
      return this.createSuccessResult(result.metadata, result.analysis);
    } catch (error) {
      return this.createErrorResult(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  async getStatus(id: string): Promise<BaseProcessingResult> {
    // In a real implementation, this would check a database or queue
    return this.createPendingResult();
  }

  private isValidPodcastResult(result: any): result is PodcastResult {
    return (
      result &&
      typeof result === "object" &&
      typeof result.refinedTranscript === "string" &&
      result.analysis &&
      result.entities &&
      Array.isArray(result.timeline)
    );
  }

  private createErrorResult(error: string): BaseProcessingResult {
    return {
      id: crypto.randomUUID(),
      status: "error" as ProcessingStatus,
      success: false,
      error,
      output: "",
      metadata: {
        format: "podcast",
        platform: "unknown",
        processedAt: new Date().toISOString(),
      },
    };
  }

  private createSuccessResult(
    metadata: ProcessingMetadata,
    analysis: ProcessingAnalysis
  ): BaseProcessingResult {
    return {
      id: crypto.randomUUID(),
      status: "completed" as ProcessingStatus,
      success: true,
      output: "",
      metadata,
      analysis,
    };
  }

  private createPendingResult(): BaseProcessingResult {
    return {
      id: crypto.randomUUID(),
      status: "pending" as ProcessingStatus,
      success: false,
      output: "",
      metadata: {
        format: "podcast",
        platform: "unknown",
        processedAt: new Date().toISOString(),
      },
    };
  }
}
