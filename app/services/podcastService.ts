import {
  TextChunk,
  ChunkOptions,
  PodcastAnalysis,
  PodcastEntities,
  TimelineEvent,
  ProcessingResult,
  ChunkResult,
  EntityDetails,
  ProcessedPodcast,
} from "@/app/types/podcast";
import { Theme } from "@/app/schemas/podcast/analysis";
import { PodcastProcessor } from "@/app/core/processing/podcast/PodcastProcessor";
import { ProcessingLogger } from "@/app/core/processing/utils/logger";
import {
  processTranscript,
  analyzeContent,
  extractEntities,
} from "@/app/actions/podcastActions";
import { mockPodcastResults } from "@/app/lib/mock/podcast-results";

export const podcastService = {
  // Mock data methods for development
  async getPodcastById(id: string): Promise<ProcessedPodcast | null> {
    // For now, always return mock data
    return mockPodcastResults;
  },

  async getPodcasts(): Promise<ProcessedPodcast[]> {
    // For now, return array with mock data
    return [mockPodcastResults];
  },

  // Timeline events detection
  async detectEvents(text: string): Promise<TimelineEvent[]> {
    // For now, return mock timeline events
    return mockPodcastResults.timeline;
  },

  // Main processing methods
  async processTranscript(
    transcript: string,
    onStateUpdate?: (state: any) => void
  ): Promise<ProcessingResult> {
    try {
      // 1. Create processor for chunking
      const processor = new PodcastProcessor();
      onStateUpdate?.({ type: "PROCESSOR_CREATED" });

      // 2. Get chunks using public method
      const chunks = await processor.createChunks(transcript);
      onStateUpdate?.({ type: "CHUNKS_CREATED", chunks });

      // 3. Process each chunk through AI
      const chunkResults = await Promise.all(
        chunks.map(async (chunk) => {
          onStateUpdate?.({ type: "CHUNK_STARTED", chunkId: chunk.id });

          // Direct calls to server actions
          const refinedText = await processTranscript(chunk);
          onStateUpdate?.({ type: "CHUNK_REFINED", chunkId: chunk.id });

          const analysis = await analyzeContent(chunk);
          onStateUpdate?.({ type: "CHUNK_ANALYZED", chunkId: chunk.id });

          const entities = await extractEntities(chunk);
          onStateUpdate?.({
            type: "CHUNK_ENTITIES_EXTRACTED",
            chunkId: chunk.id,
          });

          const result: ChunkResult = {
            id: chunk.id,
            refinedText,
            analysis,
            entities,
            timeline: [],
          };

          onStateUpdate?.({
            type: "CHUNK_COMPLETED",
            chunkId: chunk.id,
            result,
          });
          return result;
        })
      );

      // 4. Combine results
      const result = {
        transcript,
        refinedTranscript: chunkResults.map((r) => r.refinedText).join(" "),
        analysis: this.mergeAnalyses(chunkResults.map((r) => r.analysis)),
        entities: this.mergeEntities(chunkResults.map((r) => r.entities)),
        timeline: [],
      };

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
    const mergeEntityArray = (entityArrays: EntityDetails[][]) => {
      const entityMap = new Map<string, EntityDetails>();

      entityArrays.flat().forEach((entity) => {
        if (!entityMap.has(entity.name)) {
          entityMap.set(entity.name, {
            ...entity,
            mentions: [...entity.mentions],
            relationships: entity.relationships
              ? [...entity.relationships]
              : [],
          });
        } else {
          const existing = entityMap.get(entity.name)!;
          existing.mentions = [...existing.mentions, ...entity.mentions];
          if (entity.relationships) {
            existing.relationships = existing.relationships || [];
            existing.relationships.push(...entity.relationships);
          }
        }
      });

      return Array.from(entityMap.values());
    };

    return {
      people: mergeEntityArray(entities.map((e) => e.people)),
      organizations: mergeEntityArray(entities.map((e) => e.organizations)),
      locations: mergeEntityArray(entities.map((e) => e.locations)),
      events: mergeEntityArray(entities.map((e) => e.events)),
      topics: entities.some((e) => e.topics)
        ? mergeEntityArray(entities.map((e) => e.topics || []))
        : undefined,
      concepts: entities.some((e) => e.concepts)
        ? mergeEntityArray(entities.map((e) => e.concepts || []))
        : undefined,
    };
  },
};
