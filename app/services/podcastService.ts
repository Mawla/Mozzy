import {
  TextChunk,
  ChunkOptions,
  PodcastAnalysis,
  PodcastEntities,
  TimelineEvent,
  ProcessingResult,
  ChunkResult,
} from "@/app/types/podcast/processing";
import { Theme } from "@/app/schemas/podcast/analysis";
import { PodcastProcessor } from "@/app/core/processing/podcast/PodcastProcessor";
import { ProcessingLogger } from "@/app/core/processing/utils/logger";
import {
  processTranscript,
  analyzeContent,
  extractEntities,
} from "@/app/actions/podcastActions";
import { PodcastChunker } from "@/app/core/processing/podcast/PodcastChunker";

interface ProcessedPodcast {
  id: string;
  summary: string;
  themes: string[];
  keyPoints: string[];
  people: string[];
  organizations: string[];
  locations: string[];
  events: string[];
  timeline: TimelineEvent[];
  cleanTranscript: string;
  originalTranscript: string;
}

export const podcastService = {
  // Main entry point for processing
  async processFullTranscript(transcript: string): Promise<ProcessingResult> {
    const processor = new PodcastProcessor();
    const chunks = await this.chunkText(transcript);

    // Process each chunk through the AI
    const chunkResults = await Promise.all(
      chunks.map(async (chunk) => {
        const refinedText = await this.refineText(chunk.text);
        const analysis = await this.analyze(refinedText);
        const entities = await this.extractEntities(refinedText);

        const chunkResult: ChunkResult = {
          id: chunk.id,
          refinedText,
          analysis,
          entities,
          timeline: [],
        };

        return chunkResult;
      })
    );

    // Transform into final result
    return {
      transcript,
      refinedTranscript: chunkResults.map((r) => r.refinedText).join(" "),
      analysis: this.mergeAnalyses(chunkResults.map((r) => r.analysis)),
      entities: this.mergeEntities(chunkResults.map((r) => r.entities)),
      timeline: [],
    };
  },

  // Server action wrappers - client/server boundary
  async refineText(text: string): Promise<string> {
    return processTranscript(text);
  },

  async analyze(text: string): Promise<PodcastAnalysis> {
    return analyzeContent(text);
  },

  async extractEntities(text: string): Promise<PodcastEntities> {
    return extractEntities(text);
  },

  // Processing orchestration
  async processFullTranscript(transcript: string): Promise<ProcessingResult> {
    const processor = new PodcastProcessor();
    return processor.process(transcript);
  },

  // Chunking helper
  async chunkText(text: string, options?: ChunkOptions): Promise<TextChunk[]> {
    const chunker = new PodcastChunker();
    return chunker.chunk(text);
  },

  // Processing with chunks
  async processInChunks<T>(
    text: string,
    processor: (chunk: TextChunk) => Promise<T>,
    merger: (results: T[]) => T,
    chunkOptions?: ChunkOptions
  ): Promise<T> {
    const chunks = await this.chunkText(text, chunkOptions);
    const results = await Promise.all(chunks.map(processor));
    return merger(results);
  },

  // Merge utilities for combining results
  mergeAnalyses(analyses: PodcastAnalysis[]): PodcastAnalysis {
    if (!analyses.length) return {} as PodcastAnalysis;

    return {
      id: analyses[0].id,
      title: analyses[0].title,
      summary: analyses[0].summary,
      quickFacts: analyses[0].quickFacts,
      keyPoints: analyses.flatMap((a) => a.keyPoints),
      themes: this.mergeThemes(analyses.flatMap((a) => a.themes)),
      sections: analyses.flatMap((a) => a.sections || []),
    };
  },

  mergeThemes(themes: Theme[]): Theme[] {
    const themeMap = new Map<string, Theme>();
    themes.forEach((theme) => {
      if (!themeMap.has(theme.name)) {
        themeMap.set(theme.name, theme);
      } else {
        const existing = themeMap.get(theme.name)!;
        existing.relatedConcepts = Array.from(
          new Set([...existing.relatedConcepts, ...theme.relatedConcepts])
        );
      }
    });
    return Array.from(themeMap.values());
  },

  mergeEntities(entities: PodcastEntities[]): PodcastEntities {
    return {
      people: Array.from(new Set(entities.flatMap((e) => e.people))),
      organizations: Array.from(
        new Set(entities.flatMap((e) => e.organizations))
      ),
      locations: Array.from(new Set(entities.flatMap((e) => e.locations))),
      events: Array.from(new Set(entities.flatMap((e) => e.events))),
    };
  },

  // Storage methods
  async savePodcast(podcast: ProcessedPodcast): Promise<void> {
    const podcasts = this.getAllPodcasts();
    podcasts.push(podcast);
    localStorage.setItem("podcasts", JSON.stringify(podcasts));
  },

  getAllPodcasts(): ProcessedPodcast[] {
    if (typeof window === "undefined") return [];
    const podcastsJson = localStorage.getItem("podcasts");
    return podcastsJson ? JSON.parse(podcastsJson) : [];
  },

  getPodcastById(id: string): ProcessedPodcast | null {
    const podcasts = this.getAllPodcasts();
    return podcasts.find((podcast) => podcast.id === id) || null;
  },
};
