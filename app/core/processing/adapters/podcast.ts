import {
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingResult as AdapterResult,
  SentimentAnalysis,
  TimelineEvent,
  TopicAnalysis,
} from "../types";
import { PodcastProcessor } from "../podcast/PodcastProcessor";
import { logger } from "@/lib/logger";
import { ProcessingResult as PodcastResult } from "@/app/types/podcast/processing";

export class PodcastProcessingAdapter implements ProcessingAdapter {
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
  ): Promise<AdapterResult> {
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
          format: "podcast",
          platform: options.targetPlatform || "default",
          processedAt: new Date().toISOString(),
        },
      };
    }

    try {
      // Use the core processor to process the content
      const processorResult = await this.processor.process(input);

      // Type assertion after validation
      if (!this.isValidPodcastResult(processorResult)) {
        throw new Error("Invalid processor result");
      }

      const result = processorResult as PodcastResult;

      // Map the processor result to adapter result
      return {
        id,
        status: "completed",
        output: result.refinedTranscript || input,
        metadata: {
          format: "podcast",
          platform: options.targetPlatform || "default",
          processedAt: new Date().toISOString(),
          title: result.analysis?.title || "Untitled Podcast",
          duration: result.analysis?.quickFacts?.duration || "00:00:00",
          speakers: result.analysis?.quickFacts?.participants || [],
          topics: result.analysis?.themes?.map((t) => t.name) || [],
        },
        analysis: {
          entities: {
            people: result.entities.people.map((p) => p.name),
            organizations: result.entities.organizations.map((o) => o.name),
            locations: result.entities.locations.map((l) => l.name),
            concepts: [],
          },
          timeline: result.timeline.map((t) => ({
            timestamp: t.time,
            event: t.event,
            speakers: [], // Timeline events in the adapter don't include speakers
          })),
          topics: (result.analysis?.themes || []).map((theme) => ({
            name: theme.name,
            relevance: 1,
            mentions: 1,
            relatedEntities: theme.relatedConcepts,
          })),
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
          format: "podcast",
          platform: options.targetPlatform || "default",
          processedAt: new Date().toISOString(),
        },
      };
    }
  }

  async getStatus(id: string): Promise<AdapterResult> {
    // In a real implementation, this would check a database or queue
    return {
      id,
      status: "completed",
      output: "",
      metadata: {
        format: "podcast",
        platform: "default",
        processedAt: new Date().toISOString(),
      },
    };
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
}
