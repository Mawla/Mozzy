import {
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingResult,
  ProcessingStatus,
  ProcessingAnalysis,
  SentimentAnalysis,
  TimelineEvent,
  TopicAnalysis,
} from "../types";
import { PodcastProcessor } from "../podcast/PodcastProcessor";
import { logger } from "@/lib/logger";
import { ProcessingResult as PodcastResult } from "@/app/types/podcast/processing";
import { v4 as uuidv4 } from "uuid";

const generateId = () => uuidv4();

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
  ): Promise<ProcessingResult> {
    try {
      const isValid = await this.validate(input);
      if (!isValid) {
        return {
          id: generateId(),
          status: "failed" as ProcessingStatus,
          output: "",
          error: "Invalid input",
          metadata: {
            format: "podcast",
            platform: options.targetPlatform || "default",
            processedAt: new Date().toISOString(),
          },
        };
      }

      const result = await this.processor.process(input);

      const analysis: ProcessingAnalysis = {
        entities: result.analysis?.entities,
        sentiment: result.analysis?.sentiment,
        timeline: result.analysis?.timeline,
        topics: result.analysis?.themes?.map((theme) => ({
          name: theme,
          confidence: 1,
          keywords: [],
        })),
      };

      return {
        id: generateId(),
        status: "completed" as ProcessingStatus,
        output: result.output,
        metadata: {
          format: "podcast",
          platform: options.targetPlatform || "default",
          processedAt: new Date().toISOString(),
          speakers: result.metadata?.speakers,
          duration: result.metadata?.duration,
        },
        analysis,
      };
    } catch (error) {
      return {
        id: generateId(),
        status: "failed" as ProcessingStatus,
        output: "",
        error: error instanceof Error ? error.message : "Processing failed",
        metadata: {
          format: "podcast",
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
      status: "completed" as ProcessingStatus,
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
