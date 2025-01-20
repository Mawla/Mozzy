import type {
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingResult,
  ProcessingStatus,
  ProcessingAnalysis,
  SentimentAnalysis,
  TimelineEvent,
  TopicAnalysis,
  ChunkResult,
  ProcessingMetadata,
  BaseTextChunk,
} from "../types";

import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
} from "@/app/types/entities/podcast";

import { PodcastProcessor } from "../podcast/PodcastProcessor";
import { logger } from "@/lib/logger";
import { ProcessingResult as PodcastResult } from "@/app/types/podcast/processing";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const generateId = () => uuidv4();

export class PodcastProcessingAdapter implements ProcessingAdapter {
  private processor: PodcastProcessor;

  constructor() {
    this.processor = new PodcastProcessor();
  }

  async validate(input: string): Promise<boolean> {
    try {
      // Basic validation
      if (!input || typeof input !== "string") {
        return false;
      }

      // Content validation
      const minLength = 50;
      const maxLength = 1000000;
      if (input.length < minLength || input.length > maxLength) {
        return false;
      }

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error("Validation failed", error, { input });
      return false;
    }
  }

  async process(
    input: string,
    options: ProcessingOptions
  ): Promise<ProcessingResult> {
    try {
      const isValid = await this.validate(input);
      if (!isValid) {
        return this.createErrorResult("Invalid input");
      }

      const result = await this.processor.process(input, {
        analyzeSentiment: options.analyzeSentiment,
        extractEntities: options.extractEntities,
        includeTimestamps: options.includeTimestamps,
      });

      const analysis: ProcessingAnalysis = {
        id: generateId(),
        title: result.metadata?.title || "Untitled",
        summary: result.analysis?.summary || "",
        entities: result.entities,
        timeline: result.timeline || [],
        sentiment: result.analysis?.sentiment,
        topics: result.analysis?.topics || [],
        themes: result.analysis?.themes || [],
        keyPoints: result.analysis?.keyPoints || [],
        quickFacts: result.analysis?.quickFacts,
      };

      return this.createSuccessResult(
        result.output,
        {
          format: "podcast",
          platform: options.targetPlatform || "default",
          processedAt: new Date().toISOString(),
          title: result.metadata?.title,
          duration: result.metadata?.duration,
          speakers: result.metadata?.speakers,
          topics: result.metadata?.topics,
        },
        analysis
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error("Processing failed", error, { options });
      return this.createErrorResult(error.message);
    }
  }

  async getStatus(id: string): Promise<ProcessingResult> {
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

  private createErrorResult(error: string): ProcessingResult {
    return {
      id: crypto.randomUUID(),
      format: "podcast",
      status: "error" as ProcessingStatus,
      success: false,
      output: "",
      error,
      metadata: {
        format: "podcast",
        platform: "default",
        processedAt: new Date().toISOString(),
      },
      analysis: {
        id: crypto.randomUUID(),
        title: "Error Processing",
        summary: error,
      },
      entities: {
        people: [],
        organizations: [],
        locations: [],
        events: [],
      },
      timeline: [],
    };
  }

  private createSuccessResult(
    output: string,
    metadata: ProcessingMetadata,
    analysis: ProcessingAnalysis
  ): ProcessingResult {
    return {
      id: crypto.randomUUID(),
      format: "podcast",
      status: "completed" as ProcessingStatus,
      success: true,
      output,
      metadata,
      analysis,
      entities: {
        people: [],
        organizations: [],
        locations: [],
        events: [],
      },
      timeline: [],
    };
  }

  private createPendingResult(): ProcessingResult {
    return {
      id: crypto.randomUUID(),
      format: "podcast",
      status: "pending" as ProcessingStatus,
      success: false,
      output: "",
      metadata: {
        format: "podcast",
        platform: "default",
        processedAt: new Date().toISOString(),
      },
      analysis: {
        id: crypto.randomUUID(),
        title: "Processing",
        summary: "Processing podcast content...",
      },
      entities: {
        people: [],
        organizations: [],
        locations: [],
        events: [],
      },
      timeline: [],
    };
  }
}
