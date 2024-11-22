import { PROCESSING_CONFIG } from "@/app/config/processing";
import {
  ProcessingChunk,
  NetworkLog,
  TextChunk,
  ChunkOptions,
  ProcessingResult,
} from "@/app/types/podcast/processing";
import { PodcastProcessor } from "@/app/core/processing/podcast/PodcastProcessor";
import { chunkText } from "@/app/utils/textChunking";
import { ProcessingLogger } from "@/app/core/processing/utils/logger";

interface ServiceProcessingState {
  chunks: {
    id: number;
    text: string;
    status: "pending" | "processing" | "completed" | "error";
    response?: string;
    error?: string;
  }[];
  networkLogs: {
    timestamp: string;
    type: "request" | "response" | "error";
    message: string;
  }[];
  currentTranscript: string;
}

export class PodcastProcessingService {
  private state: ServiceProcessingState = {
    chunks: [],
    networkLogs: [],
    currentTranscript: "",
  };
  private processor: PodcastProcessor;
  private listeners: Set<(state: ServiceProcessingState) => void> = new Set();
  private chunkingWorker: Worker | null = null;
  private stateUpdateTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.processor = new PodcastProcessor();
    if (typeof window !== "undefined") {
      this.chunkingWorker = new Worker(
        new URL("../workers/chunkingWorker.ts", import.meta.url)
      );
    }
  }

  subscribe(callback: (state: ServiceProcessingState) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private debouncedUpdateState(newState: Partial<ServiceProcessingState>) {
    if (this.stateUpdateTimeout) {
      clearTimeout(this.stateUpdateTimeout);
    }

    this.state = { ...this.state, ...newState };

    this.stateUpdateTimeout = setTimeout(() => {
      this.listeners.forEach((listener) => listener(this.state));
      this.stateUpdateTimeout = null;
    }, 100);
  }

  private logNetwork(type: "request" | "response" | "error", message: string) {
    const timestamp = new Date().toISOString().split("T")[1].slice(0, -1);
    const newLog = { timestamp, type, message };
    this.debouncedUpdateState({
      networkLogs: [...this.state.networkLogs, newLog],
    });
  }

  async processTranscript(
    text: string,
    options: ChunkOptions = {}
  ): Promise<TextChunk[]> {
    try {
      if (!this.chunkingWorker) {
        const rawChunks = chunkText(text, options);
        const chunks = rawChunks.map((chunk, index) => {
          const textChunk: TextChunk = {
            id: index,
            text: chunk.text || "",
            startIndex: chunk.startIndex || 0,
            endIndex: chunk.endIndex || chunk.text?.length || 0,
          };

          // Log chunk creation
          ProcessingLogger.log("debug", "Created chunk", {
            chunk: textChunk,
            rawChunk: chunk,
          });

          return textChunk;
        });

        // Validate chunks before returning
        chunks.forEach((chunk, index) => {
          if (!this.validateChunk(chunk)) {
            throw new Error(`Invalid chunk created at index ${index}`);
          }
        });

        return chunks;
      }

      return new Promise((resolve, reject) => {
        this.chunkingWorker!.onmessage = (e: MessageEvent) => {
          try {
            const chunks = e.data.map((chunk: any, id: number) => {
              const textChunk: TextChunk = {
                id,
                text: chunk.text || "",
                startIndex: chunk.startIndex || 0,
                endIndex: chunk.endIndex || chunk.text?.length || 0,
              };

              // Validate each chunk from worker
              if (!this.validateChunk(textChunk)) {
                throw new Error(`Invalid chunk from worker at index ${id}`);
              }

              return textChunk;
            });

            this.debouncedUpdateState({
              chunks: chunks.map((chunk: TextChunk) => ({
                id: chunk.id,
                text: chunk.text,
                status: "pending",
              })),
            });

            resolve(chunks);
          } catch (error) {
            reject(error);
          }
        };

        this.chunkingWorker!.onerror = (error) => {
          ProcessingLogger.log("error", "Worker error", { error });
          reject(error);
        };

        this.chunkingWorker!.postMessage({ text, options });
      });
    } catch (error) {
      ProcessingLogger.log("error", "Error processing transcript", { error });
      throw error;
    }
  }

  private validateChunk(chunk: TextChunk): boolean {
    return (
      chunk !== null &&
      typeof chunk === "object" &&
      typeof chunk.text === "string" &&
      chunk.text.length > 0 &&
      typeof chunk.id === "number" &&
      Number.isInteger(chunk.id) &&
      chunk.id >= 0 &&
      typeof chunk.startIndex === "number" &&
      typeof chunk.endIndex === "number"
    );
  }

  async refineTranscript(transcript: string): Promise<ProcessingResult> {
    try {
      this.logNetwork("request", "Starting transcript processing");
      this.debouncedUpdateState({
        chunks: [],
        networkLogs: [],
        currentTranscript: "",
      });

      const result = await this.processor.process(transcript);

      this.logNetwork("response", "Completed transcript processing");
      return result;
    } catch (error) {
      this.logNetwork(
        "error",
        `Processing failed: ${(error as Error).message}`
      );
      throw error;
    }
  }

  // Clean up worker when done
  dispose() {
    if (this.stateUpdateTimeout) {
      clearTimeout(this.stateUpdateTimeout);
    }
    this.chunkingWorker?.terminate();
    this.chunkingWorker = null;
  }
}
