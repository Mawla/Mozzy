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
import { PodcastChunker } from "@/app/core/processing/podcast/PodcastChunker";
import { ProcessingLogger } from "@/app/core/processing/utils/logger";
import {
  processTranscript,
  analyzeContent,
  extractEntities,
} from "@/app/actions/podcastActions";
import { PodcastProcessor } from "@/app/core/processing/podcast/PodcastProcessor";

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
  // Main entry point - called directly from UI
  async processTranscript(
    transcript: string,
    onStateUpdate?: (state: any) => void
  ): Promise<ProcessingResult> {
    try {
      // 1. Create processor instance
      const processor = new PodcastProcessor();
      onStateUpdate?.({ type: "PROCESSOR_CREATED" });

      // 2. Delegate processing to processor
      const result = await processor.process(transcript);
      onStateUpdate?.({ type: "PROCESSING_COMPLETED", result });

      return result;
    } catch (error) {
      onStateUpdate?.({ type: "PROCESSING_ERROR", error });
      throw error;
    }
  },

  // Server action wrappers - client/server boundary
  async refineText(text: string): Promise<string> {
    return processTranscript({
      id: 0,
      text,
      startIndex: 0,
      endIndex: text.length,
    });
  },

  async analyze(text: string): Promise<PodcastAnalysis> {
    return analyzeContent({
      id: 0,
      text,
      startIndex: 0,
      endIndex: text.length,
    });
  },

  async extractEntities(text: string): Promise<PodcastEntities> {
    return extractEntities({
      id: 0,
      text,
      startIndex: 0,
      endIndex: text.length,
    });
  },

  // Merge utilities for result combination
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
