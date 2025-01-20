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
 * Creates entity-specific fields based on type with proper typing
 * @param type Entity type
 * @returns Entity-specific fields with correct types
 */
const createEntitySpecificFields = (
  type: EntityType
): Partial<
  | PersonEntity
  | OrganizationEntity
  | LocationEntity
  | EventEntity
  | TopicEntity
  | ConceptEntity
> => {
  switch (type) {
    case "PERSON":
      return {
        role: "speaker",
        context: "",
        mentions: [],
      } as Partial<PersonEntity>;
    case "ORGANIZATION":
      return {
        industry: "unknown",
        context: "",
        mentions: [],
      } as Partial<OrganizationEntity>;
    case "LOCATION":
      return {
        locationType: "unknown",
        context: "",
        mentions: [],
      } as Partial<LocationEntity>;
    case "EVENT":
      return {
        date: new Date().toISOString(),
        context: "",
        mentions: [],
      } as Partial<EventEntity>;
    case "TOPIC":
      return {
        relevance: 1,
        context: "",
        mentions: [],
      } as Partial<TopicEntity>;
    case "CONCEPT":
      return {
        definition: "",
        context: "",
        mentions: [],
      } as Partial<ConceptEntity>;
    default:
      return {};
  }
};

/**
 * Creates a validated entity with proper type and metadata
 * @param name Entity name
 * @param type Entity type
 * @param metadata Additional metadata for the entity
 * @returns Validated entity with all required fields
 */
export const createValidatedEntity = <T extends ValidatedBaseEntity>(
  name: string,
  type: EntityType,
  metadata: Partial<T> = {}
): T => {
  const now = new Date().toISOString();
  const baseFields: ValidatedBaseEntity = {
    id: crypto.randomUUID(),
    name,
    type,
    createdAt: now,
    updatedAt: now,
    context: "",
    mentions: [],
  };

  const specificFields = createEntitySpecificFields(type);

  return {
    ...baseFields,
    ...specificFields,
    ...metadata,
  } as T;
};
