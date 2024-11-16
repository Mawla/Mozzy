import { chunkText, mergeChunks } from "@/app/utils/textChunking";
import {
  PodcastAnalysis,
  PodcastEntities,
  TimelineEvent,
} from "@/app/types/podcast/processing";

interface ProcessedPodcast {
  id: string;
  summary: string;
  themes: string[];
  keyPoints: string[];
  people: string[];
  organizations: string[];
  locations: string[];
  events: string[];
  timeline: Array<{
    time: string;
    event: string;
    importance: "high" | "medium" | "low";
  }>;
  cleanTranscript: string;
  originalTranscript: string;
}

export const podcastService = {
  // Processing helpers
  async processInChunks<T>(
    text: string,
    processor: (chunk: string) => Promise<T>,
    merger: (results: T[]) => T
  ): Promise<T> {
    const chunks = chunkText(text);
    const processedChunks = await Promise.all(chunks.map(processor));
    return merger(processedChunks);
  },

  mergeAnalyses(analyses: PodcastAnalysis[]): PodcastAnalysis {
    return {
      title: analyses[0].title,
      summary: analyses[0].summary,
      quickFacts: analyses[0].quickFacts,
      keyPoints: analyses.flatMap((a) => a.keyPoints),
      themes: this.mergeThemes(analyses.flatMap((a) => a.themes)),
      sections: analyses.flatMap((a) => a.sections),
    };
  },

  mergeThemes(themes: any[]): any[] {
    const themeMap = new Map();
    themes.forEach((theme) => {
      if (!themeMap.has(theme.name)) {
        themeMap.set(theme.name, theme);
      } else {
        const existing = themeMap.get(theme.name);
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

  mergeTimelines(timelines: TimelineEvent[][]): TimelineEvent[] {
    return timelines.flat().sort((a, b) => {
      const timeA = a.time.toLowerCase();
      const timeB = b.time.toLowerCase();
      return timeA.localeCompare(timeB);
    });
  },

  // Storage methods
  async processPodcast(data: {
    type: "url" | "search" | "transcript";
    content: string;
  }): Promise<ProcessedPodcast> {
    const response = await fetch("/api/podcasts/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to process podcast");
    }

    return response.json();
  },

  savePodcast(podcast: ProcessedPodcast): void {
    const podcasts = this.getAllPodcasts();
    podcasts.push(podcast);
    localStorage.setItem("podcasts", JSON.stringify(podcasts));
  },

  getAllPodcasts(): ProcessedPodcast[] {
    const podcastsJson = localStorage.getItem("podcasts");
    return podcastsJson ? JSON.parse(podcastsJson) : [];
  },

  getPodcastById(id: string): ProcessedPodcast | null {
    const podcasts = this.getAllPodcasts();
    return podcasts.find((podcast) => podcast.id === id) || null;
  },
};
