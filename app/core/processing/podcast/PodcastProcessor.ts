import { Processor } from "../base/Processor";
import type { ProcessingResult, TextChunk } from "../types";
import { PodcastChunker } from "../podcast";
import { PodcastProcessingStrategy } from "./PodcastProcessingStrategy";
import { logger } from "@/lib/logger";
import {
  PodcastAnalysis,
  KeyPoint,
  Theme,
  ProcessingChunkResult,
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
} from "@/app/types/podcast/processing";
import {
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingStatus,
  ProcessingAnalysis,
  SentimentAnalysis,
  TopicAnalysis,
  TimelineEvent,
} from "../types";
import { v4 as uuidv4 } from "uuid";

// Local type alias for entities structure
type PodcastEntities = {
  people: PersonEntity[];
  organizations: OrganizationEntity[];
  locations: LocationEntity[];
  events: EventEntity[];
};

const generateId = () => uuidv4();

export class PodcastProcessor extends Processor<string, ProcessingResult> {
  private chunker: PodcastChunker;
  private strategy: PodcastProcessingStrategy;
  private readonly MAX_CHUNK_SIZE = 4000; // Match chunker size
  private readonly MIN_CHUNK_SIZE = 100; // Minimum meaningful chunk size

  constructor() {
    super();
    this.chunker = new PodcastChunker();
    this.strategy = new PodcastProcessingStrategy();
  }

  public async createChunks(text: string): Promise<TextChunk[]> {
    return this.chunker.chunk(text);
  }

  async process(input: string): Promise<ProcessingResult> {
    try {
      // Validate input before processing
      if (!this.validateInput(input)) {
        throw new Error("Invalid input: Empty or non-string input");
      }

      // Split input into manageable chunks
      const chunks = await this.chunker.chunk(input);

      logger.debug("Created chunks", {
        totalChunks: chunks.length,
        firstChunkPreview: chunks[0]?.text.slice(0, 100),
      });

      if (chunks.length === 0) {
        throw new Error("No valid chunks created from input");
      }

      // Process each chunk
      const results = await Promise.all(
        chunks.map(async (chunk) => {
          logger.debug("Processing chunk", {
            id: chunk.id,
            textLength: chunk.text.length,
            textPreview: chunk.text.slice(0, 100),
          });

          return this.strategy.process(chunk) as Promise<ProcessingChunkResult>;
        })
      );

      // Initialize empty entities object with default arrays
      const combinedEntities: PodcastEntities = {
        people: [],
        organizations: [],
        locations: [],
        events: [],
      };

      // Combine entities from all chunks
      const entities = results.reduce<PodcastEntities>((acc, result) => {
        if (!result.entities) return acc;

        // Helper function to merge arrays with deduplication
        const mergeEntities = <T extends { name: string }>(
          accArray: T[] = [],
          newArray: T[] = []
        ) => {
          const map = new Map<string, T>();

          // Add existing entities
          accArray.forEach((e) => {
            if (e.name) {
              map.set(e.name, e);
            }
          });

          // Add or update with new entities
          newArray.forEach((e) => {
            if (e.name) {
              map.set(e.name, e);
            }
          });

          return Array.from(map.values());
        };

        // Ensure each array is properly typed
        return {
          people: mergeEntities(acc.people || [], result.entities.people || []),
          organizations: mergeEntities(
            acc.organizations || [],
            result.entities.organizations || []
          ),
          locations: mergeEntities(
            acc.locations || [],
            result.entities.locations || []
          ),
          events: mergeEntities(acc.events || [], result.entities.events || []),
        } as PodcastEntities;
      }, combinedEntities);

      // Convert entities to the format expected by ProcessingResult
      const processedEntities = {
        people: entities.people.map((p) => p.name),
        organizations: entities.organizations.map((o) => o.name),
        locations: entities.locations.map((l) => l.name),
        concepts: entities.events.map((e) => e.name),
      };

      // Convert timeline events to the format expected by ProcessingResult
      const processedTimeline =
        results[0]?.timeline?.map(
          (event) =>
            ({
              timestamp: event.time || new Date().toISOString(),
              event: event.event,
            } as TimelineEvent)
        ) || [];

      // Convert themes to topics
      const topics = results[0]?.analysis?.themes?.map((theme) => {
        const themeName = typeof theme === "string" ? theme : theme.name;
        return {
          name: themeName,
          confidence: 1,
          keywords: [],
        } as TopicAnalysis;
      });

      return {
        id: generateId(),
        status: "completed" as ProcessingStatus,
        output: results[0]?.refinedText || input,
        metadata: {
          format: "podcast",
          platform: "default",
          processedAt: new Date().toISOString(),
          speakers: entities.people.map((p) => p.name),
          duration: "00:00:00",
        },
        analysis: {
          entities: processedEntities,
          timeline: processedTimeline,
          sentiment: {
            overall: 0,
            segments: [],
          },
          topics,
        },
      };
    } catch (error) {
      logger.error(
        "Failed to process podcast",
        error instanceof Error ? error : new Error(String(error)),
        {
          inputLength: input.length,
          inputPreview: input.slice(0, 100),
        }
      );
      return {
        id: generateId(),
        status: "failed" as ProcessingStatus,
        output: "",
        error: error instanceof Error ? error.message : "Processing failed",
        metadata: {
          format: "podcast",
          platform: "default",
          processedAt: new Date().toISOString(),
        },
      };
    }
  }

  validateInput(input: string): boolean {
    const isValid = typeof input === "string" && input.trim().length > 0;
    if (!isValid) {
      logger.error("Invalid input", undefined, {
        type: typeof input,
        length: input?.length,
        trimmedLength: input?.trim().length,
      });
    }
    return isValid;
  }

  validateOutput(output: ProcessingResult): boolean {
    const isValid =
      output.transcript !== undefined &&
      output.analysis !== undefined &&
      output.entities !== undefined &&
      output.timeline !== undefined;

    if (!isValid) {
      logger.error("Invalid output", undefined, {
        hasTranscript: output.transcript !== undefined,
        hasAnalysis: output.analysis !== undefined,
        hasEntities: output.entities !== undefined,
        hasTimeline: output.timeline !== undefined,
      });
    }

    return isValid;
  }

  private normalizeChunk(
    chunk: Partial<TextChunk>,
    index: number
  ): Partial<TextChunk> {
    return {
      id: index,
      text: typeof chunk.text === "string" ? chunk.text.trim() : "",
      startIndex: chunk.startIndex || 0,
      endIndex: chunk.endIndex || chunk.text?.length || 0,
    };
  }

  private validateChunk(chunk: Partial<TextChunk>): boolean {
    // First check if text exists and is a string
    if (!chunk?.text || typeof chunk.text !== "string") {
      logger.debug("Chunk validation failed: invalid text", {
        chunk,
        textType: typeof chunk?.text,
      });
      return false;
    }

    // Now we know text is a string, we can safely check its length
    const textLength = chunk.text.length;

    const isValid =
      chunk !== null &&
      typeof chunk === "object" &&
      textLength >= this.MIN_CHUNK_SIZE &&
      textLength <= this.MAX_CHUNK_SIZE &&
      typeof chunk.id === "number" &&
      Number.isInteger(chunk.id) &&
      chunk.id >= 0;

    if (!isValid) {
      logger.debug("Chunk validation failed", {
        chunk,
        validations: {
          isObject: chunk !== null && typeof chunk === "object",
          hasValidText: textLength >= this.MIN_CHUNK_SIZE,
          withinSizeLimit: textLength <= this.MAX_CHUNK_SIZE,
          hasValidId:
            typeof chunk.id === "number" &&
            Number.isInteger(chunk.id) &&
            chunk.id >= 0,
        },
      });
    }

    return isValid;
  }
}
