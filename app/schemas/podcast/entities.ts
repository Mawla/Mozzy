import { z } from "zod";

// Define detailed entity schemas with more flexible validation
const mentionSchema = z
  .object({
    text: z.string().optional(),
    timestamp: z.string().optional(),
    sentiment: z.string().optional(),
  })
  .partial();

const relationshipSchema = z
  .object({
    entity: z.string().optional(),
    relationship: z.string().optional(),
  })
  .partial();

const entityDetailsSchema = z
  .object({
    name: z.string().optional(),
    type: z.string().optional(),
    context: z.string().optional(),
    mentions: z.array(mentionSchema).optional().default([]),
    relationships: z.array(relationshipSchema).optional().default([]),
  })
  .partial()
  .passthrough();

export const entitySchema = z
  .object({
    people: z.array(entityDetailsSchema).optional().default([]),
    organizations: z.array(entityDetailsSchema).optional().default([]),
    locations: z.array(entityDetailsSchema).optional().default([]),
    events: z.array(entityDetailsSchema).optional().default([]),
    topics: z.array(entityDetailsSchema).optional().default([]),
    concepts: z.array(entityDetailsSchema).optional().default([]),
  })
  .partial()
  .passthrough();

// Export types
export type PodcastEntities = z.infer<typeof entitySchema>;
export type EntityDetails = z.infer<typeof entityDetailsSchema>;
export type EntityMention = z.infer<typeof mentionSchema>;
export type EntityRelationship = z.infer<typeof relationshipSchema>;
