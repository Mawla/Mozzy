import {
  processTranscript,
  analyzeContent,
  extractEntities,
  createTimeline,
} from "@/app/actions/podcastActions";
import { chunkText } from "@/app/utils/textChunking";

interface ProcessingState {
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
}

export class PodcastProcessingService {
  private state: ProcessingState = {
    chunks: [],
    networkLogs: [],
  };

  private listeners: Set<(state: ProcessingState) => void> = new Set();

  subscribe(callback: (state: ProcessingState) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private updateState(newState: Partial<ProcessingState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  private logNetwork(type: "request" | "response" | "error", message: string) {
    const timestamp = new Date().toISOString().split("T")[1].slice(0, -1);
    this.updateState({
      networkLogs: [...this.state.networkLogs, { timestamp, type, message }],
    });
  }

  async refineTranscript(transcript: string) {
    try {
      const chunks = chunkText(transcript);
      this.updateState({
        chunks: chunks.map((text, id) => ({
          id,
          text,
          status: "pending",
        })),
      });

      for (let i = 0; i < chunks.length; i++) {
        this.updateState({
          chunks: this.state.chunks.map((chunk) =>
            chunk.id === i ? { ...chunk, status: "processing" } : chunk
          ),
        });

        this.logNetwork(
          "request",
          `Processing chunk ${i + 1}/${chunks.length}`
        );

        try {
          const refinedChunk = await processTranscript(chunks[i]);
          this.logNetwork(
            "response",
            `Completed chunk ${i + 1}/${chunks.length}`
          );

          this.updateState({
            chunks: this.state.chunks.map((chunk) =>
              chunk.id === i
                ? { ...chunk, status: "completed", response: refinedChunk }
                : chunk
            ),
          });
        } catch (error) {
          this.logNetwork(
            "error",
            `Failed chunk ${i + 1}: ${(error as Error).message}`
          );
          this.updateState({
            chunks: this.state.chunks.map((chunk) =>
              chunk.id === i
                ? { ...chunk, status: "error", error: (error as Error).message }
                : chunk
            ),
          });
          throw error;
        }
      }

      const refinedTranscript = this.state.chunks
        .filter((chunk) => chunk.status === "completed")
        .map((chunk) => chunk.response)
        .join(" ");

      return { refinedTranscript };
    } catch (error) {
      console.error("Error refining transcript:", error);
      throw error;
    }
  }

  async analyzeContent(transcript: string) {
    try {
      const analysis = await analyzeContent(transcript);
      return analysis;
    } catch (error) {
      console.error("Error analyzing content:", error);
      throw error;
    }
  }

  async extractEntities(transcript: string) {
    try {
      return await extractEntities(transcript);
    } catch (error) {
      console.error("Error extracting entities:", error);
      throw error;
    }
  }

  async createTimeline(transcript: string) {
    try {
      return await createTimeline(transcript);
    } catch (error) {
      console.error("Error creating timeline:", error);
      return { timeline: [] };
    }
  }
}
