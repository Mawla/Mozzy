import {
  BaseEntity,
  EntityType,
  ValidatedBaseEntity,
} from "@/app/types/entities/base";
import {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities/podcast";
import {
  Theme,
  ContentAnalysis,
  Section,
} from "@/app/schemas/podcast/analysis";
import {
  ProcessingAnalysis,
  TopicAnalysis,
  ProcessingState,
  ChunkResult,
  ProcessingStatus,
  ProcessingResult,
  BaseTextChunk,
  TimelineEvent,
} from "@/app/core/processing/types/base";

/**
 * Type guard to validate base entity fields
 * @param entity Entity to validate
 * @returns True if entity has all required fields
 */
export const isValidBaseEntity = (
  entity: any
): entity is ValidatedBaseEntity => {
  return (
    typeof entity === "object" &&
    entity !== null &&
    typeof entity.id === "string" &&
    typeof entity.type === "string" &&
    typeof entity.createdAt === "string" &&
    typeof entity.updatedAt === "string"
  );
};

/**
 * Type-safe state update interface for podcast processing
 */
export interface ProcessingStateUpdate {
  type:
    | "PROCESSOR_CREATED"
    | "CHUNKS_CREATED"
    | "CHUNK_STARTED"
    | "CHUNK_REFINED"
    | "CHUNK_ANALYZED"
    | "CHUNK_ENTITIES_EXTRACTED"
    | "CHUNK_COMPLETED"
    | "PROCESSING_COMPLETED"
    | "PROCESSING_ERROR";
  chunkId?: string;
  chunks?: BaseTextChunk[];
  result?: ChunkResult | ProcessingResult;
  status?: ProcessingStatus;
  error?: Error;
}

/**
 * Converts a Theme to a TopicAnalysis
 * @param theme Theme from content analysis
 * @returns TopicAnalysis for processing
 */
export const themeToTopicAnalysis = (theme: Theme): TopicAnalysis => {
  return {
    name: theme.name,
    confidence: theme.relevance,
    keywords: theme.relatedConcepts,
  };
};

/**
 * Converts a Section to a TimelineEvent
 * @param section Section from content analysis
 * @returns TimelineEvent for processing
 */
export const sectionToTimelineEvent = (section: Section): TimelineEvent => {
  return {
    timestamp: section.startTime || "",
    event: section.title,
    speakers: [],
    topics: [],
    time: section.endTime,
  };
};

/**
 * Converts ContentAnalysis to ProcessingAnalysis
 * @param analysis Content analysis to convert
 * @returns ProcessingAnalysis
 */
export const contentToProcessingAnalysis = (
  analysis: ContentAnalysis
): ProcessingAnalysis => {
  return {
    title: analysis.title,
    summary: analysis.summary,
    topics: analysis.themes.map(themeToTopicAnalysis),
    sentiment: {
      overall: 0,
      segments: [],
    },
    timeline: analysis.sections.map(sectionToTimelineEvent),
    keyPoints: analysis.keyPoints.map((point) => ({
      title: point,
      description: point,
      relevance: "high",
    })),
    quickFacts: {
      duration: analysis.quickFacts.duration || "",
      participants: analysis.quickFacts.participants,
      mainTopic: analysis.quickFacts.mainTopic,
      expertise: analysis.quickFacts.expertise,
    },
  };
};

/**
 * Merges arrays of validated entities, removing duplicates by name
 * @param arrays Arrays of validated entities to merge
 * @returns Merged array with duplicates removed
 */
export const mergeValidatedEntities = <T extends ValidatedBaseEntity>(
  arrays: T[][]
): T[] => {
  const merged = arrays.flat();
  const uniqueMap = new Map<string, T>();

  merged.forEach((entity) => {
    if (isValidBaseEntity(entity)) {
      uniqueMap.set(entity.name, entity);
    }
  });

  return Array.from(uniqueMap.values());
};

/**
 * Type-safe entity merger for podcast entities
 * @param entities Array of podcast entity objects to merge
 * @returns Merged ValidatedPodcastEntities object
 */
export const mergePodcastEntities = (
  entities: ValidatedPodcastEntities[]
): ValidatedPodcastEntities => {
  return {
    people: mergeValidatedEntities(entities.map((e) => e.people || [])),
    organizations: mergeValidatedEntities(
      entities.map((e) => e.organizations || [])
    ),
    locations: mergeValidatedEntities(entities.map((e) => e.locations || [])),
    events: mergeValidatedEntities(entities.map((e) => e.events || [])),
    topics: mergeValidatedEntities(entities.map((e) => e.topics || [])),
    concepts: mergeValidatedEntities(entities.map((e) => e.concepts || [])),
  };
};

/**
 * Creates entity-specific fields based on type
 * @param type Entity type
 * @returns Entity-specific fields
 */
const createEntitySpecificFields = (type: EntityType): Record<string, any> => {
  switch (type) {
    case "PERSON":
      return { role: "speaker" }; // Default role for podcast context
    case "ORGANIZATION":
      return { industry: "unknown" }; // Default industry
    case "LOCATION":
      return { locationType: "unknown" }; // Default location type
    case "EVENT":
      return { date: new Date().toISOString() }; // Current date as default
    case "TOPIC":
      return { relevance: 1 }; // Maximum relevance as default
    case "CONCEPT":
      return { definition: "" }; // Empty definition as default
    default:
      return {};
  }
};

/**
 * Creates a validated entity of specific type with all required fields
 * @param name Entity name
 * @param type Entity type
 * @param context Optional context string
 * @returns Validated entity with all required fields
 */
export const createValidatedEntity = <T extends ValidatedBaseEntity>(
  name: string,
  type: EntityType,
  context: string = ""
): T => {
  const now = new Date().toISOString();
  const baseEntity: ValidatedBaseEntity = {
    id: crypto.randomUUID(),
    type,
    name,
    context,
    mentions: [],
    createdAt: now,
    updatedAt: now,
  };

  const specificFields = createEntitySpecificFields(type);
  return { ...baseEntity, ...specificFields } as unknown as T;
};
