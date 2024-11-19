import { PROCESSING_CONFIG } from "@/app/config/processing";
import {
  ProcessingChunk,
  NetworkLog,
  TextChunk,
  ChunkOptions,
  PodcastAnalysis,
  QuickFact,
  KeyPoint,
  Theme,
  TimelineEvent,
  PodcastEntities,
  SynthesisResult,
  MetadataResponse,
  ContentMetadata,
} from "@/app/types/podcast/processing";
import {
  processTranscript,
  analyzeContent,
  extractEntities,
  createTimeline,
} from "@/app/actions/podcastActions";
import { chunkText } from "@/app/utils/textChunking";
import {
  cleanJSONString,
  safeJSONParse,
  cleanTranscriptText,
} from "@/app/utils/stringUtils";
import {
  refinePodcastTranscript,
  suggestTags,
  generateSummary,
  generateTitle,
} from "@/app/actions/anthropicActions";
import {
  refineTranscriptPrompt,
  synthesisPrompt,
} from "@/app/prompts/podcasts";
import { combineChunkResults } from "@/app/utils/podcastUtils";

interface ServiceProcessingState {
  chunks: {
    id: number;
    text: string;
    status: "pending" | "processing" | "completed" | "error";
    response?: string;
    error?: string;
    analysis?: PodcastAnalysis;
    entities?: PodcastEntities;
    timeline?: TimelineEvent[];
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

interface ChunkResult {
  id: number;
  refinedText: string;
  analysis: PodcastAnalysis;
  entities: PodcastEntities;
  timeline: TimelineEvent[];
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
  private state: ServiceProcessingState = {
    chunks: [],
    networkLogs: [],
    currentTranscript: "",
  };

  private listeners: Set<(state: ServiceProcessingState) => void> = new Set();

  private chunkingWorker: Worker | null = null;

  private stateUpdateTimeout: NodeJS.Timeout | null = null;

  constructor() {
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
    console.log("Service State Updated:", this.state);

    this.stateUpdateTimeout = setTimeout(() => {
      this.listeners.forEach((listener) => {
        console.log("Notifying Listener:", {
          chunks: this.state.chunks.length,
        });
        listener(this.state);
      });
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

  private updateChunkStatus(
    chunkId: number,
    status: "pending" | "processing" | "completed" | "error",
    data?: {
      response?: string;
      error?: string;
      analysis?: PodcastAnalysis;
      entities?: PodcastEntities;
      timeline?: TimelineEvent[];
    }
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

    // Use debounced update for chunk status changes
    this.debouncedUpdateState({
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

  private async processChunkWithAllSteps(
    chunk: TextChunk
  ): Promise<ChunkResult> {
    try {
      // Step 1: Refine the chunk with clean text
      const cleanedText = cleanTranscriptText(chunk.text);
      const refinedText = await this.callAnthropicWithRetry(cleanedText);

      // Step 2: Analyze the refined text
      let analysis: PodcastAnalysis;
      try {
        const analysisResponse = await generateSummary(refinedText);
        const title = await generateTitle(refinedText);

        // Get raw metadata and transform it with type assertion
        const rawMetadata = (await suggestTags(refinedText)) as ContentMetadata;

        // Transform the raw metadata into the correct shape with type safety
        const metadata: MetadataResponse = {
          duration: rawMetadata?.duration ?? "0:00",
          speakers: rawMetadata?.speakers ?? [],
          mainTopic: rawMetadata?.mainTopic ?? "Unknown",
          expertise: rawMetadata?.expertise ?? "General",
          keyPoints: (rawMetadata?.keyPoints ?? []).map((point) =>
            typeof point === "string"
              ? {
                  title: point,
                  description: point,
                  relevance: "medium",
                }
              : point
          ),
          themes: (rawMetadata?.themes ?? []).map((theme) =>
            typeof theme === "string"
              ? {
                  name: theme,
                  description: theme,
                  relatedConcepts: [],
                }
              : theme
          ),
        };

        analysis = {
          id: Date.now().toString(),
          title,
          summary: analysisResponse,
          quickFacts: {
            duration: metadata.duration,
            participants: metadata.speakers,
            mainTopic: metadata.mainTopic,
            expertise: metadata.expertise,
          },
          keyPoints: metadata.keyPoints,
          themes: metadata.themes,
        };
      } catch (error) {
        console.error("Analysis error:", error);
        throw error;
      }

      // Step 3: Extract entities
      let entities: PodcastEntities;
      try {
        entities = await extractEntities(refinedText);
        if (!entities || typeof entities !== "object") {
          throw new Error("Invalid entities response");
        }
      } catch (error) {
        console.error("Entity extraction error:", error);
        entities = {
          people: [],
          organizations: [],
          locations: [],
          events: [],
        };
      }

      // Step 4: Create timeline
      let timeline: TimelineEvent[] = [];
      try {
        const timelineResult = await createTimeline(refinedText);
        if (timelineResult && Array.isArray(timelineResult.timeline)) {
          timeline = timelineResult.timeline;
        }
      } catch (error) {
        console.error("Timeline creation error:", error);
        timeline = [];
      }

      return {
        id: chunk.id,
        refinedText,
        analysis,
        entities,
        timeline,
      };
    } catch (error) {
      console.error(`Error processing chunk:`, error);
      const errorMessage =
        error instanceof Error
          ? `Processing error: ${error.message}`
          : "Unknown processing error";
      throw new Error(errorMessage);
    }
  }

  // Update the processChunksBatch method to handle large content
  private async processChunksBatch(textChunks: TextChunk[], batchSize = 3) {
    const chunks = textChunks.map((chunk, id) => ({
      id,
      text: chunk.text,
      status: "pending" as const,
    }));

    this.debouncedUpdateState({ chunks });
    this.logNetwork(
      "request",
      `Starting processing of ${chunks.length} chunks`
    );

    const results: ChunkResult[] = [];

    // Process chunks in batches
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = textChunks.slice(i, i + batchSize);
      const batchPromises = batch.map(async (chunk, batchIndex) => {
        const chunkId = i + batchIndex;
        try {
          this.updateChunkStatus(chunkId, "processing");
          this.logNetwork(
            "request",
            `Processing chunk ${chunkId + 1}/${chunks.length}`
          );

          const result = await this.processChunkWithAllSteps(chunk);

          this.updateChunkStatus(chunkId, "completed", {
            response: result.refinedText,
            analysis: result.analysis,
            entities: result.entities,
            timeline: result.timeline,
          });

          this.logNetwork(
            "response",
            `Completed chunk ${chunkId + 1}/${chunks.length}`
          );
          return result;
        } catch (error) {
          console.error(`Error processing chunk ${chunkId + 1}:`, error);
          this.updateChunkStatus(chunkId, "error", {
            error: error instanceof Error ? error.message : "Unknown error",
          });
          this.logNetwork("error", `Failed chunk ${chunkId + 1}`);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...(batchResults.filter(Boolean) as ChunkResult[]));
    }

    // Simple combination of results
    if (results.length > 0) {
      return combineChunkResults(results);
    }

    throw new Error("No chunks were successfully processed");
  }

  async refineTranscript(transcript: string) {
    try {
      console.log("Service: Starting transcript processing");
      this.debouncedUpdateState({
        chunks: [],
        networkLogs: [],
        currentTranscript: "",
      });

      const textChunks = await this.processTranscript(transcript);
      console.log(`Service: Created ${textChunks.length} chunks`);

      return await this.processChunksBatch(textChunks);
    } catch (error) {
      console.error("Service: Error in processing:", error);
      this.logNetwork(
        "error",
        `Processing failed: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async analyzeContent(transcript: string) {
    try {
      // Split transcript into chunks for parallel analysis
      const chunks = await this.processTranscript(transcript);
      const analysisResults = await this.processChunksForAnalysis(chunks);

      // Combine analysis results
      return {
        title: this.generateTitle(analysisResults),
        summary: this.combineSummaries(analysisResults),
        quickFacts: this.combineQuickFacts(analysisResults),
        keyPoints: this.combineKeyPoints(analysisResults),
        themes: this.combineThemes(analysisResults),
      };
    } catch (error) {
      console.error("Error analyzing content:", error);
      throw error;
    }
  }

  async extractEntities(transcript: string) {
    try {
      // Split transcript into chunks for parallel entity extraction
      const chunks = await this.processTranscript(transcript);
      const entityResults = await this.processChunksForEntities(chunks);

      // Combine and deduplicate entities
      return {
        people: this.deduplicateEntities(
          entityResults.flatMap((r) => r.people)
        ),
        organizations: this.deduplicateEntities(
          entityResults.flatMap((r) => r.organizations)
        ),
        locations: this.deduplicateEntities(
          entityResults.flatMap((r) => r.locations)
        ),
        events: this.deduplicateEntities(
          entityResults.flatMap((r) => r.events)
        ),
      };
    } catch (error) {
      console.error("Error extracting entities:", error);
      throw error;
    }
  }

  async createTimeline(transcript: string) {
    try {
      // Split transcript into chunks for parallel timeline creation
      const chunks = await this.processTranscript(transcript);
      const timelineResults = await this.processChunksForTimeline(chunks);

      // Combine and sort timeline events
      return {
        timeline: this.combineAndSortTimeline(timelineResults),
      };
    } catch (error) {
      console.error("Error creating timeline:", error);
      return { timeline: [] };
    }
  }

  async processTranscript(
    text: string,
    options: ChunkOptions = {}
  ): Promise<TextChunk[]> {
    if (!this.chunkingWorker) {
      const rawChunks = chunkText(text, options);
      // Convert to our TextChunk type
      const chunks: TextChunk[] = rawChunks.map((chunk, index) => ({
        id: index,
        text: chunk.text,
        startIndex: chunk.startIndex,
        endIndex: chunk.endIndex,
      }));
      return chunks;
    }

    // Use worker for chunking
    return new Promise((resolve, reject) => {
      this.chunkingWorker!.onmessage = (e: MessageEvent) => {
        const chunks = e.data;
        // Update state with chunks from worker
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

  private async processChunksForAnalysis(chunks: TextChunk[]) {
    const batchSize = PROCESSING_CONFIG.batchSize;
    const results: PodcastAnalysis[] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchPromises = batch.map(async (chunk) => {
        try {
          return await analyzeContent(chunk.text);
        } catch (error) {
          console.error(`Error analyzing chunk ${i}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...(batchResults.filter(Boolean) as PodcastAnalysis[]));
    }

    return results;
  }

  private async processChunksForEntities(chunks: TextChunk[]) {
    const batchSize = PROCESSING_CONFIG.batchSize;
    const results = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchPromises = batch.map(async (chunk) => {
        try {
          return await extractEntities(chunk.text);
        } catch (error) {
          console.error(`Error extracting entities from chunk ${i}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(Boolean));
    }

    return results;
  }

  private async processChunksForTimeline(chunks: TextChunk[]) {
    const batchSize = PROCESSING_CONFIG.batchSize;
    const results: TimelineEvent[][] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchPromises = batch.map(async (chunk) => {
        try {
          const { timeline } = await createTimeline(chunk.text);
          return timeline;
        } catch (error) {
          console.error(`Error creating timeline for chunk ${i}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...(batchResults.filter(Boolean) as TimelineEvent[][]));
    }

    return results;
  }

  private generateTitle(results: PodcastAnalysis[]): string {
    return results[0]?.title || "Untitled Analysis";
  }

  private combineSummaries(results: PodcastAnalysis[]): string {
    return results
      .map((r) => r.summary)
      .filter(Boolean)
      .join(" ");
  }

  private combineQuickFacts(results: PodcastAnalysis[]): QuickFact {
    const allParticipants = new Set<string>();
    results.forEach((r) =>
      r.quickFacts?.participants.forEach((p: string) => allParticipants.add(p))
    );

    return {
      duration: results[0]?.quickFacts?.duration || "0:00",
      participants: Array.from(allParticipants),
      mainTopic: results[0]?.quickFacts?.mainTopic || "",
      expertise: results[0]?.quickFacts?.expertise || "General",
    };
  }

  private combineKeyPoints(results: PodcastAnalysis[]): KeyPoint[] {
    const keyPointsMap = new Map<string, KeyPoint>();
    results.forEach((r) => {
      r.keyPoints?.forEach((kp: KeyPoint) => {
        if (!keyPointsMap.has(kp.title)) {
          keyPointsMap.set(kp.title, kp);
        }
      });
    });
    return Array.from(keyPointsMap.values());
  }

  private combineThemes(results: PodcastAnalysis[]): Theme[] {
    const themesMap = new Map<string, Theme>();
    results.forEach((r) => {
      r.themes?.forEach((theme: Theme) => {
        if (!themesMap.has(theme.name)) {
          themesMap.set(theme.name, theme);
        }
      });
    });
    return Array.from(themesMap.values());
  }

  private combineAndSortTimeline(
    timelineEvents: TimelineEvent[][]
  ): TimelineEvent[] {
    const eventMap = new Map<string, TimelineEvent>();
    timelineEvents.flat().forEach((event) => {
      const key = `${event.time}-${event.event}`;
      if (!eventMap.has(key)) {
        eventMap.set(key, event);
      }
    });

    return Array.from(eventMap.values()).sort((a, b) =>
      a.time.localeCompare(b.time)
    );
  }

  private deduplicateEntities(entities: string[]): string[] {
    return Array.from(new Set(entities));
  }

  private combineAnalysisResults(results: PodcastAnalysis[]): PodcastAnalysis {
    return {
      id: results[0]?.id || Date.now().toString(),
      title: this.generateTitle(results),
      summary: this.combineSummaries(results),
      quickFacts: this.combineQuickFacts(results),
      keyPoints: this.combineKeyPoints(results),
      themes: this.combineThemes(results),
    };
  }

  private combineEntityResults(results: PodcastEntities[]): PodcastEntities {
    return {
      people: this.deduplicateEntities(results.flatMap((r) => r.people)),
      organizations: this.deduplicateEntities(
        results.flatMap((r) => r.organizations)
      ),
      locations: this.deduplicateEntities(results.flatMap((r) => r.locations)),
      events: this.deduplicateEntities(results.flatMap((r) => r.events)),
    };
  }

  private async synthesizeResults(
    results: ChunkResult[]
  ): Promise<SynthesisResult> {
    try {
      // 1. First synthesize in smaller groups
      const groupSize = 3; // Process 3 chunks at a time
      const groupResults: SynthesisResult[] = [];

      for (let i = 0; i < results.length; i += groupSize) {
        const group = results.slice(i, i + groupSize);
        const groupData = group.map((result, index) => ({
          id: i + index + 1,
          refinedText: result.refinedText,
          analysis: result.analysis,
          entities: result.entities,
          timeline: result.timeline,
        }));

        // Estimate tokens
        const estimatedTokens =
          JSON.stringify(groupData).split(/\s+/).length * 1.3;

        if (estimatedTokens > 90000) {
          console.warn(
            `Group size too large (${estimatedTokens} tokens), splitting further`
          );
          const subGroupResults = await this.synthesizeSubGroup(group);
          groupResults.push(subGroupResults);
        } else {
          const groupSynthesis = await refinePodcastTranscript(
            synthesisPrompt(JSON.stringify(groupData))
          );
          const parsedSynthesis =
            safeJSONParse<SynthesisResult>(groupSynthesis);
          if (!parsedSynthesis) {
            throw new Error("Failed to parse synthesis result");
          }
          groupResults.push(parsedSynthesis);
        }
      }

      // 2. Then combine the group results
      if (groupResults.length === 1) {
        return groupResults[0];
      }

      // 3. Final synthesis of group results
      const finalSynthesisData = {
        groups: groupResults.map((result, index) => ({
          id: index + 1,
          synthesis: result.synthesis,
        })),
      };

      const finalSynthesis = await refinePodcastTranscript(
        synthesisPrompt(JSON.stringify(finalSynthesisData))
      );
      const parsedFinalSynthesis =
        safeJSONParse<SynthesisResult>(finalSynthesis);
      if (!parsedFinalSynthesis) {
        throw new Error("Failed to parse final synthesis result");
      }
      return parsedFinalSynthesis;
    } catch (error) {
      console.error("Error in synthesis:", error);
      throw error;
    }
  }

  private async synthesizeSubGroup(
    chunks: ChunkResult[]
  ): Promise<SynthesisResult> {
    // Process a single chunk at a time if group is too large
    const subResults = await Promise.all(
      chunks.map(async (chunk) => {
        const data = {
          id: chunk.id,
          refinedText: chunk.refinedText,
          analysis: chunk.analysis,
          entities: chunk.entities,
          timeline: chunk.timeline,
        };

        const synthesis = await refinePodcastTranscript(
          synthesisPrompt(JSON.stringify([data]))
        );
        const parsedSynthesis = safeJSONParse<SynthesisResult>(synthesis);
        if (!parsedSynthesis) {
          throw new Error("Failed to parse chunk synthesis result");
        }
        return parsedSynthesis;
      })
    );

    // Filter out null results and combine sub-results
    const validResults = subResults.filter(
      (result): result is SynthesisResult => result !== null
    );

    const combinedData = {
      subSyntheses: validResults.map((result, index) => ({
        id: index + 1,
        synthesis: result.synthesis,
      })),
    };

    const combinedSynthesis = await refinePodcastTranscript(
      synthesisPrompt(JSON.stringify(combinedData))
    );
    const parsedCombinedSynthesis =
      safeJSONParse<SynthesisResult>(combinedSynthesis);
    if (!parsedCombinedSynthesis) {
      throw new Error("Failed to parse combined synthesis result");
    }
    return parsedCombinedSynthesis;
  }

  // Clean up worker when done
  dispose() {
    if (this.stateUpdateTimeout) {
      clearTimeout(this.stateUpdateTimeout);
    }
    this.chunkingWorker?.terminate();
    this.chunkingWorker = null;
  }

  // Add updateStepStatus method
  private updateStepStatus(
    stepName: string,
    status: "idle" | "processing" | "completed" | "error",
    data?: any
  ) {
    this.logNetwork(
      status === "error" ? "error" : "response",
      `Step ${stepName}: ${status}${
        data ? ` with ${Object.keys(data).length} items` : ""
      }`
    );
  }

  // Add callOpenAI method
  private async callOpenAI(prompt: string): Promise<string> {
    try {
      // TODO: Implement actual OpenAI call
      // For now, return mock data
      return JSON.stringify({
        synthesis: {
          title: "Mock Synthesis",
          summary: "Mock summary of the content",
          quickFacts: {
            duration: "10:00",
            participants: ["Speaker 1", "Speaker 2"],
            mainTopics: ["Topic 1", "Topic 2"],
            expertise: "General",
          },
          keyPoints: [],
          themes: [],
          narrative: {
            beginning: "Start",
            development: "Middle",
            conclusion: "End",
            transitions: [],
          },
          connections: {
            crossReferences: [],
            conceptualLinks: [],
            thematicArcs: [],
          },
        },
      });
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      throw error;
    }
  }

  private async callAnthropicWithRetry(
    prompt: string,
    maxRetries = PROCESSING_CONFIG.maxRetries
  ): Promise<string> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        // Calculate approximate tokens (rough estimate)
        const estimatedTokens = prompt.split(/\s+/).length * 1.3;

        // Check if within Claude's context window (100k tokens)
        if (estimatedTokens > 90000) {
          throw new Error("Input exceeds maximum context length");
        }

        const response = await refinePodcastTranscript(prompt);
        return response;
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) throw error;

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, PROCESSING_CONFIG.retryDelay)
        );
      }
    }
    throw new Error("All retry attempts failed");
  }
}
