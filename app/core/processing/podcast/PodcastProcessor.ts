import { Processor } from "../base/Processor";
import {
  ProcessingStep,
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingStatus,
  ProcessingAnalysis,
  SentimentAnalysis,
  TopicAnalysis,
  TimelineEvent,
  BaseTextChunk,
  ProcessingResult,
  ProcessingFormat,
} from "@/app/types/processing/base";

import type {
  ValidatedPodcastEntities,
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  ValidatedPersonEntity,
  ValidatedOrganizationEntity,
  ValidatedLocationEntity,
  ValidatedEventEntity,
  ValidatedTopicEntity,
  ValidatedConceptEntity,
} from "@/app/types/entities/podcast";

import { PodcastChunker } from "./PodcastChunker";
import { PodcastProcessingStrategy } from "./PodcastProcessingStrategy";
import { logger } from "@/lib/logger";
import { v4 as uuidv4 } from "uuid";
import { createValidatedEntity } from "@/app/utils/type-conversion/entity";

interface PodcastChunkResult {
  id: string;
  text: string;
  refinedText: string;
  status: ProcessingStatus;
  progress: number;
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
    topics: TopicEntity[];
    concepts: ConceptEntity[];
  };
}

export class PodcastProcessor extends Processor<string, ProcessingResult> {
  private chunker: PodcastChunker;
  private strategy: PodcastProcessingStrategy;
  private readonly MAX_CHUNK_SIZE = 4000;
  private readonly MIN_CHUNK_SIZE = 100;

  constructor() {
    super();
    this.chunker = new PodcastChunker();
    this.strategy = new PodcastProcessingStrategy();
  }

  public async createChunks(text: string): Promise<BaseTextChunk[]> {
    return this.chunker.chunk(text);
  }

  async process(input: string): Promise<ProcessingResult> {
    try {
      if (!this.validateInput(input)) {
        throw new Error("Invalid input: Empty or non-string input");
      }

      const chunks = await this.chunker.chunk(input);

      logger.debug("Created chunks", {
        totalChunks: chunks.length,
        firstChunkPreview: chunks[0]?.text.slice(0, 100),
      });

      if (chunks.length === 0) {
        throw new Error("No valid chunks created from input");
      }

      const results = await Promise.all(
        chunks.map(async (chunk) => {
          logger.debug("Processing chunk", {
            id: chunk.id,
            textLength: chunk.text.length,
            textPreview: chunk.text.slice(0, 100),
          });

          await this.strategy.process(chunk.text);
          const chunkResult: PodcastChunkResult = {
            id: chunk.id,
            text: chunk.text,
            refinedText: chunk.text,
            status: "completed" as ProcessingStatus,
            progress: 100,
            entities: {
              people: [],
              organizations: [],
              locations: [],
              events: [],
              topics: [],
              concepts: [],
            },
          };
          return chunkResult;
        })
      );

      // Combine entities from all chunks
      const combinedEntities = results.reduce(
        (acc, result) => {
          if (!result.entities) return acc;

          return {
            people: [...acc.people, ...result.entities.people],
            organizations: [
              ...acc.organizations,
              ...result.entities.organizations,
            ],
            locations: [...acc.locations, ...result.entities.locations],
            events: [...acc.events, ...result.entities.events],
            topics: [...acc.topics, ...result.entities.topics],
            concepts: [...acc.concepts, ...result.entities.concepts],
          };
        },
        {
          people: [] as PersonEntity[],
          organizations: [] as OrganizationEntity[],
          locations: [] as LocationEntity[],
          events: [] as EventEntity[],
          topics: [] as TopicEntity[],
          concepts: [] as ConceptEntity[],
        }
      );

      // Create validated entities
      const validatedEntities: ValidatedPodcastEntities = {
        people: combinedEntities.people.map((e) =>
          createValidatedEntity<ValidatedPersonEntity>(e.name, "PERSON", {
            role: e.role || "speaker",
            expertise: e.expertise || ["unknown"],
            context: e.context || "",
            mentions: e.mentions || [],
          })
        ),
        organizations: combinedEntities.organizations.map((e) =>
          createValidatedEntity<ValidatedOrganizationEntity>(
            e.name,
            "ORGANIZATION",
            {
              industry: e.industry || "unknown",
              size: e.size || "unknown",
              context: e.context || "",
              mentions: e.mentions || [],
            }
          )
        ),
        locations: combinedEntities.locations.map((e) =>
          createValidatedEntity<ValidatedLocationEntity>(e.name, "LOCATION", {
            locationType: e.locationType || "unknown",
            region: e.region,
            coordinates: e.coordinates,
            context: e.context || "",
            mentions: e.mentions || [],
          })
        ),
        events: combinedEntities.events.map((e) =>
          createValidatedEntity<ValidatedEventEntity>(e.name, "EVENT", {
            date: e.date || new Date().toISOString(),
            duration: e.duration || "unknown",
            participants: e.participants || ["unknown"],
            context: e.context || "",
            mentions: e.mentions || [],
          })
        ),
        topics: combinedEntities.topics.map((e) =>
          createValidatedEntity<ValidatedTopicEntity>(e.name, "TOPIC", {
            relevance: e.relevance,
            subtopics: e.subtopics,
            context: e.context || "",
            mentions: e.mentions || [],
          })
        ),
        concepts: combinedEntities.concepts.map((e) =>
          createValidatedEntity<ValidatedConceptEntity>(e.name, "CONCEPT", {
            definition: e.definition || "unknown",
            examples: e.examples || ["unknown"],
            context: e.context || "",
            mentions: e.mentions || [],
          })
        ),
      };

      const result: ProcessingResult = {
        id: uuidv4(),
        format: "podcast" as ProcessingFormat,
        status: "completed",
        success: true,
        output: results[0]?.refinedText || "",
        metadata: {
          format: "podcast",
          platform: "default",
          processedAt: new Date().toISOString(),
        },
        analysis: {
          id: uuidv4(),
          title: "Podcast Analysis",
          summary: "Processed podcast content",
          entities: validatedEntities,
          timeline: [],
        },
        entities: validatedEntities,
        timeline: [],
        transcript: results.map((r) => r.refinedText).join(" "),
        chunks: results.map((r) => ({
          id: r.id,
          text: r.text,
          refinedText: r.refinedText,
        })),
      };

      if (!this.validateOutput(result)) {
        throw new Error("Invalid processing result");
      }

      return result;
    } catch (error) {
      logger.error(
        "Error in podcast processing",
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  public validateInput(input: string): boolean {
    return typeof input === "string" && input.length > 0;
  }

  public validateOutput(output: ProcessingResult): boolean {
    return (
      output.id !== undefined &&
      output.format === "podcast" &&
      output.status !== undefined &&
      output.success !== undefined &&
      output.output !== undefined &&
      output.metadata !== undefined &&
      output.metadata.format === "podcast" &&
      output.metadata.platform !== undefined &&
      output.metadata.processedAt !== undefined &&
      output.analysis !== undefined &&
      output.entities !== undefined &&
      output.timeline !== undefined &&
      output.transcript !== undefined &&
      output.chunks !== undefined
    );
  }
}
