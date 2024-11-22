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
    if (!this.chunkingWorker) {
      const rawChunks = chunkText(text, options);
      return rawChunks.map((chunk, index) => ({
        id: index,
        text: chunk.text,
        startIndex: chunk.startIndex,
        endIndex: chunk.endIndex,
      }));
    }

    return new Promise((resolve, reject) => {
      this.chunkingWorker!.onmessage = (e: MessageEvent) => {
        const chunks = e.data;
        this.debouncedUpdateState({
          chunks: chunks.map((chunk: TextChunk, id: number) => ({
            id,
            text: chunk.text,
            status: "pending",
          })),
        });
        resolve(chunks);
      };

      this.chunkingWorker!.onerror = (error) => {
        reject(error);
      };

      this.chunkingWorker!.postMessage({ text, options });
    });
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
