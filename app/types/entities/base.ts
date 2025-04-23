import { z } from "zod";

/**
 * Represents a mention of an entity with context and sentiment analysis.
 * Used to track where and how entities are referenced in content.
 */
export interface EntityMention {
  /** The exact text where the entity was mentioned */
  text: string;
  /** Sentiment score of the mention (-1 to 1) */
  sentiment: "positive" | "negative" | "neutral";
  /** Optional timestamp for when the mention occurred (ISO format) */
  timestamp?: string;
}

/**
 * Represents a relationship between two entities with context.
 * Used to track how different entities are connected in content.
 */
export interface EntityRelationship {
  /** The ID or name of the related entity */
  entity: string;
  /** The type of relationship between entities */
  relationship: string;
  /** Optional context explaining the relationship */
  context?: string;
}

/**
 * Base entity interface with common properties for all entity types.
 * Provides core fields that all specific entity types must implement.
 */
export interface BaseEntity {
  /** Unique identifier for the entity */
  id: string;
  /** Type classification of the entity */
  type: string;
  /** Display name of the entity */
  name: string;
  /** Contextual information about the entity */
  context: string;
  /** List of mentions of this entity in content */
  mentions: EntityMention[];
  /** Creation timestamp (ISO format) */
  createdAt: string;
  /** Last update timestamp (ISO format) */
  updatedAt: string;
  /** Optional list of relationships to other entities */
  relationships?: EntityRelationship[];
}

/**
 * Common entity type classifications used across the system.
 * Each type has specific validation and processing rules.
 */
export type EntityType =
  | "PERSON"
  | "ORGANIZATION"
  | "LOCATION"
  | "EVENT"
  | "TOPIC"
  | "CONCEPT";

// Base validation schema
export const baseEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  context: z.string(),
  mentions: z.array(
    z.object({
      text: z.string(),
      sentiment: z.enum(["positive", "negative", "neutral"]),
      timestamp: z.string().optional(),
    })
  ),
  relationships: z
    .array(
      z.object({
        entity: z.string(),
        relationship: z.string(),
        context: z.string().optional(),
      })
    )
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Export type helpers
export type ValidatedBaseEntity = z.infer<typeof baseEntitySchema>;

/**
 * Represents a person entity with specific person-related properties.
 * Used for tracking individuals mentioned in content.
 */
export interface PersonEntity extends BaseEntity {
  type: "PERSON";
  /** Professional title or role */
  title?: string;
  /** Organization affiliations */
  affiliations?: string[];
  /** Required areas of expertise or topics associated with person */
  expertise: string[];
  /** Required role of the person in the context */
  role: string;
}

/**
 * Represents an organization entity with specific organization-related properties.
 * Used for tracking companies, institutions, and other organizations.
 */
export interface OrganizationEntity extends BaseEntity {
  type: "ORGANIZATION";
  /** Required industry or sector classification */
  industry: string;
  /** Optional detailed description */
  description?: string;
  /** Optional location of headquarters or main office */
  location?: string;
  /** Required size classification of the organization */
  size: string;
}

/**
 * Represents geographic coordinates with latitude and longitude.
 * Used for precise location positioning in the system.
 */
export interface Coordinates {
  /** Latitude value between -90 and 90 degrees */
  latitude: number;
  /** Longitude value between -180 and 180 degrees */
  longitude: number;
}

/**
 * Standard location type classifications.
 * Used to categorize different types of locations in the system.
 */
export enum LocationType {
  /** City or urban area */
  CITY = "CITY",
  /** Country or nation */
  COUNTRY = "COUNTRY",
  /** Geographic or administrative region */
  REGION = "REGION",
  /** Notable place or monument */
  LANDMARK = "LANDMARK",
  /** Specific street address or location */
  ADDRESS = "ADDRESS",
}

/**
 * Represents a location entity with specific location-related properties.
 * Used for tracking places mentioned in content.
 */
export interface LocationEntity extends BaseEntity {
  /** Must be LOCATION type */
  type: Extract<EntityType, "LOCATION">;
  /** Required type of location (city, country, etc.) */
  locationType: LocationType;
  /** Optional geographic coordinates */
  coordinates?: Coordinates;
  /** Optional geographic region */
  region?: string;
  /** Optional parent location (e.g., country for a city) */
  parent?: string;
  /** Optional country of the location */
  country?: string;
}

/**
 * Represents an event entity with specific event-related properties.
 * Used for tracking events mentioned in content.
 */
export interface EventEntity extends BaseEntity {
  type: "EVENT";
  /** Optional start date of the event */
  startDate?: string;
  /** Optional end date of the event */
  endDate?: string;
  /** Optional location of the event */
  location?: string;
  /** Optional type of event */
  eventType?: string;
  /** Required date of the event (ISO format) */
  date: string;
  /** Required duration of the event */
  duration: string;
  /** Required list of event participants */
  participants: string[];
}

/**
 * Represents a topic entity with specific topic-related properties.
 * Used for tracking subjects and themes in content.
 */
export interface TopicEntity extends BaseEntity {
  type: "TOPIC";
  /** Parent topics */
  parentTopics?: string[];
  /** Related keywords */
  keywords?: string[];
  /** Topic category */
  category: string;
  /** Relevance of the topic */
  relevance: number;
  /** Subtopics related to the topic */
  subtopics: string[];
}

/**
 * Represents a concept entity with specific concept-related properties.
 * Used for tracking abstract ideas and concepts in content.
 */
export interface ConceptEntity extends BaseEntity {
  type: "CONCEPT";
  /** Definition or explanation */
  definition: string;
  /** Related concepts */
  relatedConcepts?: string[];
  /** Domain or field */
  domain: string;
  /** Examples of the concept */
  examples: string[];
}

// Coordinates validation schema
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Location validation schema
export const locationEntitySchema = baseEntitySchema.extend({
  type: z.literal("LOCATION"),
  locationType: z.nativeEnum(LocationType),
  coordinates: coordinatesSchema.optional(),
  region: z.string().optional(),
  parent: z.string().optional(),
  country: z.string().optional(),
});

// Export type helpers
export type ValidatedLocationEntity = z.infer<typeof locationEntitySchema>;
