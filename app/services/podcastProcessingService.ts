import {
  ProcessingResult,
  ProcessingState,
  ProcessingChunk,
  ChunkResult,
  TextChunk,
} from "@/app/types/podcast/processing";
import { podcastService } from "@/app/services/podcastService";

type ChunkStatus = "pending" | "processing" | "completed" | "error";

type ProcessingStatus =
  | { type: "PROCESSOR_CREATED" }
  | { type: "CHUNKS_CREATED"; chunks: TextChunk[] }
  | { type: "CHUNK_STARTED"; chunkId: number }
  | { type: "CHUNK_REFINED"; chunkId: number }
  | { type: "CHUNK_ANALYZED"; chunkId: number }
  | { type: "CHUNK_ENTITIES_EXTRACTED"; chunkId: number }
  | { type: "CHUNK_COMPLETED"; chunkId: number; result: ChunkResult }
  | { type: "PROCESSING_COMPLETED"; result: ProcessingResult }
  | { type: "PROCESSING_ERROR"; error: Error };

export class PodcastProcessingService {
  private state: ProcessingState = {
    chunks: [],
    networkLogs: [],
    currentTranscript: "",
  };
  private listeners: Set<(state: ProcessingState) => void> = new Set();
  private stateUpdateTimeout: NodeJS.Timeout | null = null;

  subscribe(callback: (state: ProcessingState) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private updateState(status: ProcessingStatus) {
    switch (status.type) {
      case "CHUNKS_CREATED":
        this.state.chunks = status.chunks.map((chunk) => ({
          id: chunk.id,
          text: chunk.text,
          status: "pending",
        }));
        break;
      case "CHUNK_STARTED":
        this.updateChunkStatus(status.chunkId, "processing");
        break;
      case "CHUNK_COMPLETED":
        this.updateChunkStatus(status.chunkId, "completed", status.result);
        break;
      case "PROCESSING_ERROR":
        this.addNetworkLog("error", status.error.message);
        break;
      // ... handle other status types
    }

    this.notifyListeners();
  }

  private updateChunkStatus(
    chunkId: number,
    status: ChunkStatus,
    result?: ChunkResult
  ) {
    const chunk = this.state.chunks.find(
      (c) => c.id === chunkId
    ) as ProcessingChunk;
    if (chunk) {
      chunk.status = status;
      if (result && status === "completed") {
        chunk.response = result.refinedText;
        chunk.analysis = result.analysis;
        chunk.entities = result.entities;
        chunk.timeline = result.timeline;
      }
    }
  }

  private addNetworkLog(
    type: "request" | "response" | "error",
    message: string
  ) {
    const timestamp = new Date().toISOString();
    this.state.networkLogs.push({ timestamp, type, message });
  }

  private notifyListeners() {
    if (this.stateUpdateTimeout) {
      clearTimeout(this.stateUpdateTimeout);
    }

    this.stateUpdateTimeout = setTimeout(() => {
      this.listeners.forEach((listener) => listener(this.state));
      this.stateUpdateTimeout = null;
    }, 100);
  }

  async refineTranscript(transcript: string): Promise<ProcessingResult> {
    try {
      // Reset state
      this.state = {
        chunks: [],
        networkLogs: [],
        currentTranscript: transcript,
      };

      // Process using podcastService
      return await podcastService.processTranscript(
        transcript,
        this.updateState.bind(this)
      );
    } catch (error) {
      this.updateState({ type: "PROCESSING_ERROR", error: error as Error });
      throw error;
    }
  }

  dispose() {
    if (this.stateUpdateTimeout) {
      clearTimeout(this.stateUpdateTimeout);
    }
    this.listeners.clear();
  }
}
