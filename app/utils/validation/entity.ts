import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/app/lib/logger";
import {
  personEntitySchema,
  organizationEntitySchema,
  locationEntitySchema,
  eventEntitySchema,
  topicEntitySchema,
  conceptEntitySchema,
  podcastEntitySchema,
  type ValidatedPodcastEntity,
  type ValidatedPersonEntity,
  type ValidatedOrganizationEntity,
  type ValidatedLocationEntity,
  type ValidatedEventEntity,
  type ValidatedTopicEntity,
  type ValidatedConceptEntity,
} from "@/app/types/entities/podcast";

type EntitySchemaMap = {
  PERSON: typeof personEntitySchema;
  ORGANIZATION: typeof organizationEntitySchema;
  LOCATION: typeof locationEntitySchema;
  EVENT: typeof eventEntitySchema;
  TOPIC: typeof topicEntitySchema;
  CONCEPT: typeof conceptEntitySchema;
};

type EntityTypeMap = {
  PERSON: ValidatedPersonEntity;
  ORGANIZATION: ValidatedOrganizationEntity;
  LOCATION: ValidatedLocationEntity;
  EVENT: ValidatedEventEntity;
  TOPIC: ValidatedTopicEntity;
  CONCEPT: ValidatedConceptEntity;
};

/**
 * Creates a new entity with required base fields and validates it against its schema
 * @param entityData Partial entity data to create
 * @param type The type of entity to create
 * @returns Validated entity or throws validation error
 */
export function createEntity<T extends keyof EntityTypeMap>(
  entityData: Partial<EntityTypeMap[T]>,
  type: T
): EntityTypeMap[T] {
  const now = new Date().toISOString();
  const baseFields = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    mentions: [],
    type,
    ...entityData,
  };

  try {
    const schema = {
      PERSON: personEntitySchema,
      ORGANIZATION: organizationEntitySchema,
      LOCATION: locationEntitySchema,
      EVENT: eventEntitySchema,
      TOPIC: topicEntitySchema,
      CONCEPT: conceptEntitySchema,
    }[type] as EntitySchemaMap[T];

    return schema.parse(baseFields) as EntityTypeMap[T];
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Entity validation failed", error, { entityData, type });
    }
    throw error;
  }
}

/**
 * Validates an existing entity against its schema
 * @param entity Entity to validate
 * @returns Validated entity or throws validation error
 */
export function validateEntity<T extends ValidatedPodcastEntity>(entity: T): T {
  try {
    return podcastEntitySchema.parse(entity) as T;
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Entity validation failed", error, { entity });
    }
    throw error;
  }
}

/**
 * Updates an existing entity with new data and validates it
 * @param entity Existing entity to update
 * @param updates Partial updates to apply
 * @returns Updated and validated entity
 */
export function updateEntity<T extends ValidatedPodcastEntity>(
  entity: T,
  updates: Partial<T>
): T {
  const updatedEntity = {
    ...entity,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    return validateEntity(updatedEntity);
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Entity update validation failed", error, {
        entity,
        updates,
      });
    }
    throw error;
  }
}

/**
 * Validates an array of entities
 * @param entities Array of entities to validate
 * @returns Array of validated entities or throws validation error
 */
export function validateEntities<T extends ValidatedPodcastEntity>(
  entities: T[]
): T[] {
  return entities.map((entity) => validateEntity(entity));
}

/**
 * Creates multiple entities of the same type
 * @param entitiesData Array of partial entity data
 * @param type The type of entities to create
 * @returns Array of validated entities
 */
export function createEntities<T extends keyof EntityTypeMap>(
  entitiesData: Partial<EntityTypeMap[T]>[],
  type: T
): EntityTypeMap[T][] {
  return entitiesData.map((data) => createEntity(data, type));
}
