import type {
  ProcessingState as BaseProcessingState,
  ProcessingStep as BaseProcessingStep,
  ProcessingStatus as BaseProcessingStatus,
  NetworkLog,
  BaseTextChunk,
  ChunkResult,
} from "@/app/types/processing/base";

import type {
  ProcessingChunk,
  ProcessingResult,
  ProcessingOptions,
  PodcastAnalysis,
  TextChunk,
} from "@/app/types/podcast/processing";

import { podcastService } from "@/app/services/podcastService";

type ChunkStatus = Extract<
  BaseProcessingStatus,
  "pending" | "processing" | "completed" | "error"
>;

type ProcessingStateUpdate =
  | { type: "PROCESSOR_CREATED" }
  | { type: "CHUNKS_CREATED"; chunks: TextChunk[] }
  | { type: "CHUNK_STARTED"; chunkId: number }
  | { type: "CHUNK_REFINED"; chunkId: number }
  | { type: "CHUNK_ANALYZED"; chunkId: number }
  | { type: "CHUNK_ENTITIES_EXTRACTED"; chunkId: number }
  | { type: "CHUNK_COMPLETED"; chunkId: number; result: ChunkResult }
  | { type: "PROCESSING_COMPLETED"; result: ProcessingResult }
  | { type: "PROCESSING_ERROR"; error: Error };

interface ProcessingState extends BaseProcessingState {
  status: BaseProcessingStatus;
  error?: Error;
  overallProgress: number;
  steps: BaseProcessingStep[];
  chunks: ProcessingChunk[];
  networkLogs: NetworkLog[];
  currentTranscript: string;
}

export class PodcastProcessingService {
  private state: ProcessingState = {
    status: "idle",
    error: undefined,
    overallProgress: 0,
    steps: [],
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

  private updateState(status: ProcessingStateUpdate) {
    switch (status.type) {
      case "CHUNKS_CREATED":
        this.state.chunks = status.chunks.map((chunk) => ({
          ...chunk,
          status: "pending" as const,
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
    const chunk = this.state.chunks.find((c) => c.id === chunkId.toString());
    if (chunk) {
      chunk.status = status;
      if (result && status === "completed") {
        chunk.result = result;
      }
    }
  }

  private addNetworkLog(type: NetworkLog["type"], message: string) {
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

  private findChunkById(chunkId: string): ProcessingChunk | undefined {
    return this.state.chunks.find(
      (c) => c.id.toString() === chunkId.toString()
    );
  }

  async processTranscript(transcript: string): Promise<ProcessingResult> {
    this.state = {
      status: "idle",
      error: undefined,
      overallProgress: 0,
      steps: [],
      chunks: [],
      networkLogs: [],
      currentTranscript: transcript,
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
      analysis: result.analysis as PodcastAnalysis,
      entities: result.entities || {
        people: [],
        organizations: [],
        locations: [],
        events: [],
      },
      timeline: result.timeline || [],
      refinedTranscript: result.output || "",
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
