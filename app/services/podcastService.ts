import type {
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingResult,
  ProcessingState,
  ProcessingStatus,
  BaseTextChunk,
  ProcessingChunk,
  ProcessingAnalysis,
  TimelineEvent,
  ProcessingMetadata,
  ChunkResult,
  TopicAnalysis,
  SentimentAnalysis,
} from "@/app/types/processing/base";

import type {
  BaseEntity,
  EntityType,
  ValidatedBaseEntity,
} from "@/app/types/entities/base";

import type {
  ValidatedPersonEntity,
  ValidatedOrganizationEntity,
  ValidatedLocationEntity,
  ValidatedEventEntity,
  ValidatedTopicEntity,
  ValidatedConceptEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities/podcast";

import { PodcastProcessor } from "@/app/core/processing/podcast/PodcastProcessor";
import {
  processTranscript,
  analyzeContent,
  extractEntities,
} from "@/app/actions/podcastActions";
import { mockPodcastResults } from "@/app/lib/mock/podcast-results";
import { TextChunk } from "@/app/utils/textChunking";
import { ContentAnalysis } from "@/app/schemas/podcast/analysis";
import { processingLogger } from "@/app/lib/logger";
import {
  createValidatedPodcastEntity,
  mergePodcastEntities,
  ProcessingStateUpdate,
  contentToProcessingAnalysis,
} from "@/app/utils/type-conversion/entity";

export const podcastService = {
  // Mock data methods for development
  async getPodcastById(id: string): Promise<ProcessingResult | null> {
    // For now, always return mock data
    return mockPodcastResults;
  },

  async getPodcasts(): Promise<ProcessingResult[]> {
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
                createValidatedPodcastEntity<ValidatedPersonEntity>(
                  name,
                  "PERSON",
                  {
                    role: "speaker",
                    expertise: ["unknown"],
                    context: "",
                    mentions: [],
                  }
                )
              ) || [],
            organizations:
              rawEntities.organizations?.map((name: string) =>
                createValidatedPodcastEntity<ValidatedOrganizationEntity>(
                  name,
                  "ORGANIZATION",
                  {
                    industry: "unknown",
                    size: "unknown",
                    context: "",
                    mentions: [],
                  }
                )
              ) || [],
            locations:
              rawEntities.locations?.map((name: string) =>
                createValidatedPodcastEntity<ValidatedLocationEntity>(
                  name,
                  "LOCATION",
                  {
                    locationType: "unknown",
                    context: "",
                    mentions: [],
                  }
                )
              ) || [],
            events:
              rawEntities.events?.map((name: string) =>
                createValidatedPodcastEntity<ValidatedEventEntity>(
                  name,
                  "EVENT",
                  {
                    date: new Date().toISOString(),
                    duration: "unknown",
                    participants: ["unknown"],
                    context: "",
                    mentions: [],
                  }
                )
              ) || [],
            topics:
              rawEntities.topics?.map((topic: string) =>
                createValidatedPodcastEntity<ValidatedTopicEntity>(
                  topic,
                  "TOPIC",
                  {
                    relevance: 1,
                    subtopics: [],
                    context: "",
                    mentions: [],
                  }
                )
              ) || [],
            concepts:
              rawEntities.concepts?.map((concept: string) =>
                createValidatedPodcastEntity<ValidatedConceptEntity>(
                  concept,
                  "CONCEPT",
                  {
                    definition: "unknown",
                    examples: ["unknown"],
                    context: "",
                    mentions: [],
                  }
                )
              ) || [],
          };

          const result: ChunkResult = {
            id: chunkId,
            status: "completed",
            success: true,
            output: chunk.text,
            refinedText,
            format: "podcast",
            metadata: {
              format: "podcast",
              platform: "web",
              processedAt: new Date().toISOString(),
            },
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
        chunkResults
          .map((result) => result.analysis)
          .filter(
            (analysis): analysis is ProcessingAnalysis => analysis !== undefined
          )
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
      processingLogger.error(
        "Error processing transcript",
        error instanceof Error ? error : new Error(String(error))
      );
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
          createValidatedPodcastEntity<ValidatedPersonEntity>(name, "PERSON", {
            role: "speaker",
            context: "",
            mentions: [],
          })
        ) || [],
      organizations:
        rawEntities.organizations?.map((name: string) =>
          createValidatedPodcastEntity<ValidatedOrganizationEntity>(
            name,
            "ORGANIZATION",
            {
              context: "",
              mentions: [],
            }
          )
        ) || [],
      locations:
        rawEntities.locations?.map((name: string) =>
          createValidatedPodcastEntity<ValidatedLocationEntity>(
            name,
            "LOCATION",
            {
              context: "",
              mentions: [],
            }
          )
        ) || [],
      events:
        rawEntities.events?.map((name: string) =>
          createValidatedPodcastEntity<ValidatedEventEntity>(name, "EVENT", {
            context: "",
            mentions: [],
          })
        ) || [],
      topics:
        rawEntities.topics?.map((topic: string) =>
          createValidatedPodcastEntity<ValidatedTopicEntity>(topic, "TOPIC", {
            context: "",
            mentions: [],
          })
        ) || [],
      concepts:
        rawEntities.concepts?.map((concept: string) =>
          createValidatedPodcastEntity<ValidatedConceptEntity>(
            concept,
            "CONCEPT",
            {
              context: "",
              mentions: [],
            }
          )
        ) || [],
    };
  },

  // Helper method to merge analyses from multiple chunks
  mergeAnalyses(analyses: ProcessingAnalysis[]): ProcessingAnalysis {
    // Filter out any undefined values
    const validAnalyses = analyses.filter(
      (a): a is ProcessingAnalysis => a !== undefined
    );

    if (!validAnalyses.length) {
      return {
        title: "",
        summary: "",
        topics: [],
        sentiment: { overall: 0, segments: [] },
        timeline: [],
        keyPoints: [],
        quickFacts: {
          duration: "",
          participants: [],
          mainTopic: "",
          expertise: "",
        },
      };
    }

    // Use first analysis as base
    const base = validAnalyses[0];

    // Merge topics
    const topicsMap = new Map<string, TopicAnalysis>();
    validAnalyses.forEach((analysis) => {
      if (analysis.topics) {
        analysis.topics.forEach((topic) => {
          const existing = topicsMap.get(topic.name);
          if (existing) {
            // Average confidence if topic already exists
            existing.confidence = (existing.confidence + topic.confidence) / 2;
            // Merge keywords without duplicates
            existing.keywords = Array.from(
              new Set([...existing.keywords, ...topic.keywords])
            );
          } else {
            topicsMap.set(topic.name, { ...topic });
          }
        });
      }
    });

    // Merge timelines
    const timelineMap = new Map<string, TimelineEvent>();
    validAnalyses.forEach((analysis) => {
      if (analysis.timeline) {
        analysis.timeline.forEach((event) => {
          if (!timelineMap.has(event.timestamp)) {
            timelineMap.set(event.timestamp, event);
          }
        });
      }
    });

    // Merge key points
    const keyPointsSet = new Set<string>();
    const mergedKeyPoints = validAnalyses.flatMap((analysis) => {
      return (
        analysis.keyPoints?.filter((point) => {
          const key = point.title;
          if (keyPointsSet.has(key)) return false;
          keyPointsSet.add(key);
          return true;
        }) || []
      );
    });

    // Merge quick facts
    const allParticipants = new Set<string>();
    const allExpertise = new Set<string>();
    validAnalyses.forEach((analysis) => {
      if (analysis.quickFacts) {
        analysis.quickFacts.participants?.forEach((p) =>
          allParticipants.add(p)
        );
        if (typeof analysis.quickFacts.expertise === "string") {
          allExpertise.add(analysis.quickFacts.expertise);
        }
      }
    });

    // Create merged analysis with proper type handling
    const mergedAnalysis: ProcessingAnalysis = {
      title: base.title || "",
      summary: base.summary || "",
      topics: Array.from(topicsMap.values()),
      sentiment: base.sentiment || { overall: 0, segments: [] },
      timeline: Array.from(timelineMap.values()).sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp)
      ),
      keyPoints: mergedKeyPoints,
      quickFacts: {
        duration: base.quickFacts?.duration || "",
        participants: Array.from(allParticipants),
        mainTopic: base.quickFacts?.mainTopic || "",
        expertise: Array.from(allExpertise).join(", ") || "",
      },
    };

    return mergedAnalysis;
  },
};
