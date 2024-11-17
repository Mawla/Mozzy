import {
  processTranscript as processTranscriptAction,
  analyzeContent,
  extractEntities,
  createTimeline,
} from "@/app/actions/podcastActions";
import { chunkText } from "@/app/utils/textChunking";
import { ChunkOptions, TextChunk } from "../types/podcast/processing";

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
  currentTranscript: string;
}

interface ProcessTranscriptOptions {
  content: string;
  type: "url" | "search" | "transcript";
}

export const processTranscriptLocal = async ({
  content,
  type,
}: ProcessTranscriptOptions) => {
  console.log("processTranscriptLocal called", { type });

  // Validate input
  if (typeof content !== "string") {
    console.error("Invalid content type:", typeof content);
    throw new Error(
      "Invalid transcript format. Expected string but got: " + typeof content
    );
  }

  if (!content.trim()) {
    console.error("Empty content");
    throw new Error("Transcript content cannot be empty");
  }

  try {
    console.log("Processing transcript with type:", type);
    // Process the transcript based on type
    switch (type) {
      case "transcript":
        const result = await processRawTranscript(content);
        console.log("Transcript processed successfully");
        return result;
      case "url":
      case "search":
        throw new Error(`${type} processing is not yet implemented`);
      default:
        throw new Error("Invalid processing type");
    }
  } catch (error) {
    console.error("Error processing transcript:", error);
    throw error;
  }
};

const processRawTranscript = async (content: string) => {
  // Remove any potential object notation strings
  if (content.includes("[object Object]")) {
    console.warn("Found [object Object] in transcript, cleaning...");
    content = content.replace(/\[object Object\]/g, "");
  }

  // Basic transcript cleaning
  return content
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, "\n") // Replace multiple newlines with single newline
    .replace(/^\s+|\s+$/gm, ""); // Trim whitespace from start/end of each line
};

export class PodcastProcessingService {
  private state: ProcessingState = {
    chunks: [],
    networkLogs: [],
    currentTranscript: "",
  };

  private listeners: Set<(state: ProcessingState) => void> = new Set();

  private chunkingWorker: Worker | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.chunkingWorker = new Worker(
        new URL("../workers/chunkingWorker.ts", import.meta.url)
      );
    }
  }

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
    const newLog = { timestamp, type, message };
    this.updateState({
      networkLogs: [...this.state.networkLogs, newLog],
    });
  }

  private updateChunkStatus(
    chunkId: number,
    status: "pending" | "processing" | "completed" | "error",
    data?: { response?: string; error?: string }
  ) {
    const updatedChunks = this.state.chunks.map((chunk) =>
      chunk.id === chunkId
        ? {
            ...chunk,
            status,
            ...(data || {}),
          }
        : chunk
    );

    // Update state and notify listeners immediately
    this.updateState({
      chunks: updatedChunks,
      currentTranscript:
        status === "completed" && data?.response
          ? updatedChunks
              .filter((chunk) => chunk.status === "completed")
              .map((chunk) => chunk.response)
              .filter(Boolean)
              .join(" ")
          : this.state.currentTranscript,
    });
  }

  async refineTranscript(transcript: string) {
    try {
      console.log("Service: Starting transcript refinement");
      // Reset state
      this.updateState({
        chunks: [],
        networkLogs: [],
        currentTranscript: "",
      });

      // Initialize chunks with the text content
      console.log("Service: Processing transcript into chunks");
      const textChunks = await this.processTranscript(transcript);
      console.log(`Service: Created ${textChunks.length} chunks`);

      // Update state with initial chunks
      this.updateState({
        chunks: textChunks.map((chunk, id) => ({
          id,
          text: chunk.text,
          status: "pending",
        })),
      });

      this.logNetwork(
        "request",
        `Starting processing of ${textChunks.length} chunks`
      );

      // Process chunks sequentially to maintain order
      for (let i = 0; i < textChunks.length; i++) {
        try {
          console.log(
            `Service: Processing chunk ${i + 1}/${textChunks.length}`
          );
          // Update status to processing
          this.updateChunkStatus(i, "processing");
          this.logNetwork(
            "request",
            `Processing chunk ${i + 1}/${textChunks.length}`
          );

          // Process the chunk
          const refinedChunk = await processTranscriptAction(
            textChunks[i].text
          );

          // Update status to completed with the refined content
          this.updateChunkStatus(i, "completed", {
            response: refinedChunk,
          });

          // Emit state update for visualization
          this.updateState({
            currentTranscript: this.state.chunks
              .filter((chunk) => chunk.status === "completed")
              .map((chunk) => chunk.response)
              .filter(Boolean)
              .join(" "),
          });

          this.logNetwork(
            "response",
            `Completed chunk ${i + 1}/${textChunks.length}`
          );
        } catch (error) {
          console.error(`Service: Error processing chunk ${i + 1}:`, error);
          this.updateChunkStatus(i, "error", {
            error: (error as Error).message,
          });
          this.logNetwork(
            "error",
            `Failed chunk ${i + 1}: ${(error as Error).message}`
          );
          throw error;
        }
      }

      console.log("Service: All chunks processed successfully");
      this.logNetwork("response", "All chunks processed successfully");
      return { refinedTranscript: this.state.currentTranscript };
    } catch (error) {
      console.error("Service: Error in refineTranscript:", error);
      this.logNetwork(
        "error",
        `Processing failed: ${(error as Error).message}`
      );
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

  async processTranscript(
    text: string,
    options: ChunkOptions = {}
  ): Promise<TextChunk[]> {
    // If worker is not available, use synchronous processing
    if (!this.chunkingWorker) {
      const chunks = chunkText(text, options);
      // Update state with chunks immediately
      this.updateState({
        chunks: chunks.map((chunk, id) => ({
          id,
          text: chunk.text,
          status: "pending",
        })),
      });
      return chunks;
    }

    // Use worker for chunking
    return new Promise((resolve, reject) => {
      this.chunkingWorker!.onmessage = (e: MessageEvent) => {
        const chunks = e.data;
        // Update state with chunks from worker
        this.updateState({
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

  // Clean up worker when done
  dispose() {
    this.chunkingWorker?.terminate();
    this.chunkingWorker = null;
  }
}
