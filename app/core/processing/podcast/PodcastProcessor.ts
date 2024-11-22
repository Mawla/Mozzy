import { Processor } from "../base/Processor";
import type { ProcessingResult, TextChunk, ChunkResult } from "../types";
import { PodcastChunker } from "../podcast";
import { PodcastProcessingStrategy } from "./PodcastProcessingStrategy";
import { ProcessingLogger } from "../utils/logger";

export class PodcastProcessor extends Processor<string, ProcessingResult> {
  private chunker: PodcastChunker;
  private strategy: PodcastProcessingStrategy;
  private readonly MAX_CHUNK_SIZE = 24000; // Claude's approximate token limit
  private readonly MIN_CHUNK_SIZE = 100; // Minimum meaningful chunk size

  constructor() {
    super();
    this.chunker = new PodcastChunker();
    this.strategy = new PodcastProcessingStrategy();
  }

  async process(input: string): Promise<ProcessingResult> {
    try {
      // Validate input before processing
      if (!this.validateInput(input)) {
        throw new Error("Invalid input: Empty or non-string input");
      }

      // Split input into manageable chunks
      const chunks = await this.chunker.chunk(input);

      // Filter out invalid chunks and normalize them
      const validChunks = chunks
        .map((chunk, index) => this.normalizeChunk(chunk, index))
        .filter((chunk): chunk is TextChunk => {
          const isValid = this.validateChunk(chunk);
          if (!isValid) {
            ProcessingLogger.log("warn", "Filtered out invalid chunk", {
              chunk,
            });
          }
          return isValid;
        });

      if (validChunks.length === 0) {
        throw new Error("No valid chunks created from input");
      }

      ProcessingLogger.log("info", `Processing ${validChunks.length} chunks`, {
        totalChunks: chunks.length,
        validChunks: validChunks.length,
      });

      // Process each valid chunk using our strategy
      const results = await Promise.all(
        validChunks.map(async (chunk) => {
          ProcessingLogger.log("debug", "Processing chunk", {
            id: chunk.id,
            textLength: chunk.text.length,
          });

          return this.strategy.process(chunk);
        })
      );

      // Combine the chunk results
      const combinedResult = await this.strategy.combine(results);

      // Transform ChunkResult into ProcessingResult
      return {
        transcript: input,
        refinedTranscript: combinedResult.refinedText,
        analysis: combinedResult.analysis,
        entities: combinedResult.entities,
        timeline: combinedResult.timeline,
      };
    } catch (error) {
      ProcessingLogger.log("error", "Failed to process podcast", { error });
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
