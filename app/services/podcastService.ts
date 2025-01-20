import {
  BaseTextChunk,
  ProcessingResult,
  ProcessingChunk,
  ProcessingAnalysis,
  TimelineEvent,
  ProcessingMetadata,
  ProcessingStatus,
  ChunkResult,
  TopicAnalysis,
  SentimentAnalysis,
} from "@/app/core/processing/types/base";
import {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities/podcast";
import { PodcastProcessor } from "@/app/core/processing/podcast/PodcastProcessor";
import {
  processTranscript,
  analyzeContent,
  extractEntities,
} from "@/app/actions/podcastActions";
import { mockPodcastResults } from "@/app/lib/mock/podcast-results";
import {
  BaseEntity,
  EntityType,
  ValidatedBaseEntity,
} from "@/app/types/entities/base";
import { TextChunk } from "@/app/utils/textChunking";
import { Theme, ContentAnalysis } from "@/app/schemas/podcast/analysis";
import { processingLogger } from "@/app/lib/logger";
import {
  createValidatedEntity,
  mergePodcastEntities,
  ProcessingStateUpdate,
  contentToProcessingAnalysis,
  themeToTopicAnalysis,
} from "@/app/utils/type-conversion/entity";

interface MockTopic {
  title: string;
  metadata?: {
    relatedTopics?: string[];
  };
}

interface MockEvent {
  date: string;
  title: string;
}

const convertMockToProcessingResult = (mock: any): ProcessingResult => {
  const now = new Date().toISOString();
  const validatedEntities: ValidatedPodcastEntities = {
    people: mock.people.map((name: string) =>
      createValidatedEntity<PersonEntity>(name, "PERSON")
    ),
    organizations: mock.organizations.map((name: string) =>
      createValidatedEntity<OrganizationEntity>(name, "ORGANIZATION")
    ),
    locations: mock.locations.map((name: string) =>
      createValidatedEntity<LocationEntity>(name, "LOCATION")
    ),
    events: mock.events.map((name: string) =>
      createValidatedEntity<EventEntity>(name, "EVENT")
    ),
    topics: mock.topics.map((topic: MockTopic) =>
      createValidatedEntity<TopicEntity>(topic.title, "TOPIC")
    ),
    concepts:
      mock.concepts?.map((concept: string) =>
        createValidatedEntity<ConceptEntity>(concept, "CONCEPT")
      ) || [],
  };

  return {
    id: mock.id,
    status: "completed" as ProcessingStatus,
    success: true,
    format: "podcast",
    transcript: "",
    output: "",
    metadata: {
      format: "podcast",
      platform: "web",
      processedAt: now,
    },
    analysis: {
      title: mock.title,
      summary: mock.summary,
      quickFacts: mock.quickFacts,
      keyPoints: mock.keyPoints.map((point: string) => ({
        title: point,
        description: point,
        relevance: "high",
      })),
      topics: mock.topics.map((topic: MockTopic) => ({
        name: topic.title,
        confidence: 1,
        keywords: topic.metadata?.relatedTopics || [],
      })) as TopicAnalysis[],
      sentiment: {
        overall: 0,
        segments: [],
      } as SentimentAnalysis,
      timeline: [],
    },
    entities: validatedEntities,
    timeline: mock.timeline.map((event: MockEvent) => ({
      timestamp: event.date,
      event: event.title,
      speakers: [],
      topics: [],
    })),
  };
};

export const podcastService = {
  // Mock data methods for development
  async getPodcastById(id: string): Promise<ProcessingResult | null> {
    // For now, always return mock data
    return convertMockToProcessingResult(mockPodcastResults);
  },

  async getPodcasts(): Promise<ProcessingResult[]> {
    // For now, return array with mock data
    return [convertMockToProcessingResult(mockPodcastResults)];
  },

  // Timeline events detection
  async detectEvents(text: string): Promise<TimelineEvent[]> {
    // For now, return mock timeline events
    return convertMockToProcessingResult(mockPodcastResults).timeline;
  },

  // Main processing methods
  async processTranscript(
    transcript: string,
    onStateUpdate?: (state: ProcessingStateUpdate) => void
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
        chunks.map(async (chunk: BaseTextChunk) => {
          const chunkId = chunk.id || crypto.randomUUID();
          const textChunk: TextChunk = {
            text: chunk.text,
            index: 0,
            startIndex: chunk.startIndex || 0,
            endIndex: chunk.endIndex || chunk.text.length,
          };
          onStateUpdate?.({ type: "CHUNK_STARTED", chunkId });

          // Direct calls to server actions
          const refinedText = await processTranscript(textChunk);
          onStateUpdate?.({ type: "CHUNK_REFINED", chunkId });

          const analysis = await analyzeContent(textChunk);
          onStateUpdate?.({ type: "CHUNK_ANALYZED", chunkId });

          const rawEntities = await extractEntities(textChunk);
          onStateUpdate?.({
            type: "CHUNK_ENTITIES_EXTRACTED",
            chunkId,
          });

          const entities: ValidatedPodcastEntities = {
            people:
              rawEntities.people?.map((name: string) =>
                createValidatedEntity<PersonEntity>(name, "PERSON")
              ) || [],
            organizations:
              rawEntities.organizations?.map((name: string) =>
                createValidatedEntity<OrganizationEntity>(name, "ORGANIZATION")
              ) || [],
            locations:
              rawEntities.locations?.map((name: string) =>
                createValidatedEntity<LocationEntity>(name, "LOCATION")
              ) || [],
            events:
              rawEntities.events?.map((name: string) =>
                createValidatedEntity<EventEntity>(name, "EVENT")
              ) || [],
            topics:
              rawEntities.topics?.map((topic: string) =>
                createValidatedEntity<TopicEntity>(topic, "TOPIC")
              ) || [],
            concepts:
              rawEntities.concepts?.map((concept: string) =>
                createValidatedEntity<ConceptEntity>(concept, "CONCEPT")
              ) || [],
          };

          const result: ChunkResult = {
            id: chunkId,
            text: chunk.text,
            refinedText,
            analysis: contentToProcessingAnalysis(analysis),
            entities,
            timeline: [],
          };

          onStateUpdate?.({
            type: "CHUNK_COMPLETED",
            chunkId,
            result,
          });
          return result;
        })
      );

      // 4. Merge results
      const mergedAnalysis = this.mergeAnalyses(
        chunkResults.map((result) => result.analysis)
      );
      const mergedEntities = mergePodcastEntities(
        chunkResults.map((result) => result.entities)
      );

      // 5. Create final result
      const result: ProcessingResult = {
        id: crypto.randomUUID(),
        status: "completed",
        success: true,
        format: "podcast",
        transcript,
        output: chunkResults.map((r) => r.refinedText).join("\n"),
        metadata: {
          format: "podcast",
          platform: "web",
          processedAt: new Date().toISOString(),
        },
        analysis: mergedAnalysis,
        entities: mergedEntities,
        timeline: [],
      };

      onStateUpdate?.({
        type: "PROCESSING_COMPLETED",
        result,
      });

      return result;
    } catch (error) {
      processingLogger.error("Error processing transcript", error);
      onStateUpdate?.({
        type: "PROCESSING_ERROR",
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }
  },

  // Server action wrappers - client/server boundary
  async refineText(text: string): Promise<string> {
    const chunk: TextChunk = {
      text,
      index: 0,
      startIndex: 0,
      endIndex: text.length,
    };
    return processTranscript(chunk);
  },

  async analyze(text: string): Promise<ProcessingAnalysis> {
    const chunk: TextChunk = {
      text,
      index: 0,
      startIndex: 0,
      endIndex: text.length,
    };
    const analysis = await analyzeContent(chunk);
    return contentToProcessingAnalysis(analysis);
  },

  async extractEntities(text: string): Promise<ValidatedPodcastEntities> {
    const chunk: TextChunk = {
      text,
      index: 0,
      startIndex: 0,
      endIndex: text.length,
    };
    const rawEntities = await extractEntities(chunk);
    return {
      people:
        rawEntities.people?.map((name: string) =>
          createValidatedEntity<PersonEntity>(name, "PERSON")
        ) || [],
      organizations:
        rawEntities.organizations?.map((name: string) =>
          createValidatedEntity<OrganizationEntity>(name, "ORGANIZATION")
        ) || [],
      locations:
        rawEntities.locations?.map((name: string) =>
          createValidatedEntity<LocationEntity>(name, "LOCATION")
        ) || [],
      events:
        rawEntities.events?.map((name: string) =>
          createValidatedEntity<EventEntity>(name, "EVENT")
        ) || [],
      topics:
        rawEntities.topics?.map((topic: string) =>
          createValidatedEntity<TopicEntity>(topic, "TOPIC")
        ) || [],
      concepts:
        rawEntities.concepts?.map((concept: string) =>
          createValidatedEntity<ConceptEntity>(concept, "CONCEPT")
        ) || [],
    };
  },

  // Merge utilities for result combination
  mergeAnalyses(
    analyses: (ProcessingAnalysis | undefined)[]
  ): ProcessingAnalysis {
    if (!analyses.length)
      return {
        title: "",
        summary: "",
        quickFacts: {
          duration: "",
          participants: [],
          mainTopic: "",
          expertise: "",
        },
        keyPoints: [],
        topics: [],
        sentiment: {
          overall: 0,
          segments: [],
        },
        timeline: [],
      };

    const firstAnalysis = analyses[0];
    if (!firstAnalysis)
      return {
        title: "",
        summary: "",
        quickFacts: {
          duration: "",
          participants: [],
          mainTopic: "",
          expertise: "",
        },
        keyPoints: [],
        topics: [],
        sentiment: {
          overall: 0,
          segments: [],
        },
        timeline: [],
      };

    return {
      title: firstAnalysis.title || "",
      summary: firstAnalysis.summary || "",
      quickFacts: firstAnalysis.quickFacts || {
        duration: "",
        participants: [],
        mainTopic: "",
        expertise: "",
      },
      keyPoints: analyses.flatMap((a) => a?.keyPoints || []),
      topics: analyses.flatMap((a) => a?.topics || []) as TopicAnalysis[],
      sentiment: firstAnalysis.sentiment || {
        overall: 0,
        segments: [],
      },
      timeline: analyses.flatMap((a) => a?.timeline || []),
    };
  },

  mergeEntities(
    entities: ValidatedPodcastEntities[]
  ): ValidatedPodcastEntities {
    const mergeEntityArray = <T extends ValidatedBaseEntity>(
      entityArrays: T[][]
    ) => {
      const entityMap = new Map<string, T>();

      entityArrays.flat().forEach((entity) => {
        if (!entityMap.has(entity.name)) {
          entityMap.set(entity.name, {
            ...entity,
            mentions: [...entity.mentions],
            relationships: entity.relationships
              ? [...entity.relationships]
              : [],
          } as T);
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
