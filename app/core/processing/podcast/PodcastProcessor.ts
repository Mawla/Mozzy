import { Processor } from "../base/Processor";
import type { ProcessingResult, TextChunk } from "../types";
import { PodcastChunker } from "../podcast";
import { PodcastProcessingStrategy } from "./PodcastProcessingStrategy";
import { ProcessingLogger } from "../utils/logger";
import { PodcastEntities, EntityDetails } from "@/app/schemas/podcast/entities";
import {
  PodcastAnalysis,
  KeyPoint,
  Theme,
} from "@/app/types/podcast/processing";

interface ProcessingChunkResult {
  refinedText: string;
  entities?: PodcastEntities;
  analysis?: {
    summary?: string;
    keyPoints?: KeyPoint[];
    themes?: Theme[];
  };
  timeline?: any[];
}

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

      ProcessingLogger.log("debug", "Created chunks", {
        totalChunks: chunks.length,
        firstChunkPreview: chunks[0]?.text.slice(0, 100),
      });

      if (chunks.length === 0) {
        throw new Error("No valid chunks created from input");
      }

      // Process each chunk
      const results = await Promise.all(
        chunks.map(async (chunk) => {
          ProcessingLogger.log("debug", "Processing chunk", {
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
        topics: [],
        concepts: [],
      };

      // Combine entities from all chunks
      const entities = results.reduce<PodcastEntities>((acc, result) => {
        if (!result.entities) return acc;

        // Helper function to merge arrays with deduplication
        const mergeEntities = (
          accArray: EntityDetails[] = [],
          newArray: EntityDetails[] = []
        ) => {
          const map = new Map<string, EntityDetails>();

          // Add existing entities
          accArray.forEach((e) => {
            if (e.name) {
              const entity: EntityDetails = {
                name: e.name,
                type: e.type,
                context: e.context,
                mentions: e.mentions || [],
                relationships: e.relationships || [],
              };
              map.set(e.name, entity);
            }
          });

          // Add or update with new entities
          newArray.forEach((e) => {
            if (e.name) {
              const entity: EntityDetails = {
                name: e.name,
                type: e.type,
                context: e.context,
                mentions: e.mentions || [],
                relationships: e.relationships || [],
              };
              map.set(e.name, entity);
            }
          });

          return Array.from(map.values());
        };

        // Ensure each array is properly typed as EntityDetails[]
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
          topics: mergeEntities(acc.topics || [], result.entities.topics || []),
          concepts: mergeEntities(
            acc.concepts || [],
            result.entities.concepts || []
          ),
        } as PodcastEntities;
      }, combinedEntities);

      // Combine analysis from all chunks
      const combinedAnalysis: PodcastAnalysis = {
        id: "combined-analysis",
        title: "Combined Analysis",
        summary:
          results.find((r) => r.analysis?.summary)?.analysis?.summary || "",
        quickFacts: {
          duration: "0:00",
          participants: [],
          mainTopic: "",
          expertise: "General",
        },
        keyPoints: Array.from(
          new Set(results.flatMap((r) => r.analysis?.keyPoints || []))
        ),
        themes: Array.from(
          new Set(results.flatMap((r) => r.analysis?.themes || []))
        ),
      };

      return {
        transcript: input,
        refinedTranscript: results[0]?.refinedText || input,
        analysis: combinedAnalysis,
        entities: entities,
        timeline: results[0]?.timeline || [],
      };
    } catch (error) {
      ProcessingLogger.log("error", "Failed to process podcast", {
        error,
        inputLength: input.length,
        inputPreview: input.slice(0, 100),
      });
      throw error;
    }
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
      ProcessingLogger.log("debug", "Chunk validation failed: invalid text", {
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
      ProcessingLogger.log("debug", "Chunk validation failed", {
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

  validateInput(input: string): boolean {
    const isValid = typeof input === "string" && input.trim().length > 0;
    if (!isValid) {
      ProcessingLogger.log("error", "Invalid input", {
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
      ProcessingLogger.log("error", "Invalid output", {
        hasTranscript: output.transcript !== undefined,
        hasAnalysis: output.analysis !== undefined,
        hasEntities: output.entities !== undefined,
        hasTimeline: output.timeline !== undefined,
      });
    }

    return isValid;
  }
}
