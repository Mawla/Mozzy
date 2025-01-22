import type {
  BaseEntity,
  EntityType,
  ValidatedBaseEntity,
} from "@/app/types/entities/base";

import type {
  ProcessingAnalysis,
  ProcessingResult,
  TopicAnalysis,
  ProcessingStatus,
  BaseTextChunk,
  TimelineEvent,
  ProcessingState,
} from "@/app/types/processing";

import {
  ValidatedPodcastEntities,
  ValidatedPersonEntity,
  ValidatedOrganizationEntity,
  ValidatedLocationEntity,
  ValidatedEventEntity,
  ValidatedTopicEntity,
  ValidatedConceptEntity,
} from "@/app/types/entities/podcast";

import {
  Theme,
  ContentAnalysis,
  Section,
} from "@/app/schemas/podcast/analysis";

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
  result?: ProcessingResult;
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
 * Creates entity-specific fields based on type with proper typing
 * @param type Entity type
 * @returns Entity-specific fields with correct types
 */
const createEntitySpecificFields = (
  type: EntityType
): Partial<
  | ValidatedPersonEntity
  | ValidatedOrganizationEntity
  | ValidatedLocationEntity
  | ValidatedEventEntity
  | ValidatedTopicEntity
  | ValidatedConceptEntity
> => {
  const baseFields = {
    context: "",
    mentions: [],
  };

  switch (type) {
    case "PERSON":
      return {
        ...baseFields,
        role: "speaker",
        expertise: ["unknown"],
      } as Partial<ValidatedPersonEntity>;
    case "ORGANIZATION":
      return {
        ...baseFields,
        industry: "unknown",
        size: "unknown",
      } as Partial<ValidatedOrganizationEntity>;
    case "LOCATION":
      return {
        ...baseFields,
        locationType: "unknown",
      } as Partial<ValidatedLocationEntity>;
    case "EVENT":
      return {
        ...baseFields,
        date: new Date().toISOString(),
        duration: "unknown",
        participants: ["unknown"],
      } as Partial<ValidatedEventEntity>;
    case "TOPIC":
      return {
        ...baseFields,
        relevance: 1,
        subtopics: [],
      } as Partial<ValidatedTopicEntity>;
    case "CONCEPT":
      return {
        ...baseFields,
        definition: "unknown",
        examples: ["unknown"],
      } as Partial<ValidatedConceptEntity>;
    default:
      return baseFields;
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

/**
 * Creates a validated podcast entity with proper type and metadata
 * @param name Entity name
 * @param type Entity type
 * @param specificFields Entity-specific fields
 * @returns Validated podcast entity with all required fields
 */
export const createValidatedPodcastEntity = <T extends ValidatedBaseEntity>(
  name: string,
  type: EntityType,
  specificFields: Partial<T>
): T => {
  const baseFields = {
    id: `${type.toLowerCase()}-${Date.now()}`,
    type,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    ...baseFields,
    ...createEntitySpecificFields(type),
    ...specificFields,
  } as T;
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
    people: mergeValidatedEntities<ValidatedPersonEntity>(
      entities.map((e) => e.people || [])
    ),
    organizations: mergeValidatedEntities<ValidatedOrganizationEntity>(
      entities.map((e) => e.organizations || [])
    ),
    locations: mergeValidatedEntities<ValidatedLocationEntity>(
      entities.map((e) => e.locations || [])
    ),
    events: mergeValidatedEntities<ValidatedEventEntity>(
      entities.map((e) => e.events || [])
    ),
    topics: mergeValidatedEntities<ValidatedTopicEntity>(
      entities.map((e) => e.topics || [])
    ),
    concepts: mergeValidatedEntities<ValidatedConceptEntity>(
      entities.map((e) => e.concepts || [])
    ),
  };
};
