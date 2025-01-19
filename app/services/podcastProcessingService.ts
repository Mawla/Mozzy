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
    status: "idle",
    steps: [],
    overallProgress: 0,
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

  private findChunkById(chunkId: string): BaseTextChunk | undefined {
    return this.state.chunks.find(
      (c) => c.id.toString() === chunkId.toString()
    );
  }

  async processTranscript(transcript: string): Promise<ProcessingResult> {
    this.state = {
      chunks: [],
      networkLogs: [],
      currentTranscript: transcript,
      status: "idle",
      steps: [],
      overallProgress: 0,
    };

    const result = await podcastService.processTranscript(transcript);
    return {
      id: crypto.randomUUID(),
      format: "podcast",
      status: "completed",
      success: true,
      output: result.output || "",
      metadata: {
        format: "podcast",
        platform: "default",
        processedAt: new Date().toISOString(),
      },
      analysis: result.analysis,
      entities: result.entities || {
        people: [],
        organizations: [],
        locations: [],
        events: [],
      },
      timeline: result.timeline || [],
    };
  }

  dispose() {
    if (this.stateUpdateTimeout) {
      clearTimeout(this.stateUpdateTimeout);
    }
    this.listeners.clear();
  }

  getState(): ProcessingState {
    return { ...this.state };
  }
}
