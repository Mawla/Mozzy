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
  /** Display name of the entity */
  name: string;
  /** Type classification of the entity */
  type: string;
  /** Contextual information about the entity */
  context: string;
  /** List of mentions of this entity in content */
  mentions: EntityMention[];
  /** Optional list of relationships to other entities */
  relationships?: EntityRelationship[];
  /** Creation timestamp (ISO format) */
  createdAt: string;
  /** Last update timestamp (ISO format) */
  updatedAt: string;
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
