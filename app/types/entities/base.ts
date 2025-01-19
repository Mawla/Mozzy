import { z } from "zod";

// Base mention type for capturing entity mentions with context
export interface EntityMention {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  timestamp?: string;
}

// Base relationship type for capturing entity relationships
export interface EntityRelationship {
  entity: string;
  relationship: string;
  context?: string;
}

// Base entity interface with common properties
export interface BaseEntity {
  id: string;
  name: string;
  type: string;
  context: string;
  mentions: EntityMention[];
  relationships?: EntityRelationship[];
  createdAt: string;
  updatedAt: string;
}

// Common entity types
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
