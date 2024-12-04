import { z } from "zod";

// Mention schema for capturing entity mentions with context
const mentionSchema = z.object({
  text: z.string(),
  sentiment: z.enum(["positive", "negative", "neutral"]),
  timestamp: z.string().optional(),
});

// Relationship schema for capturing entity relationships
const relationshipSchema = z.object({
  entity: z.string(),
  relationship: z.string(),
  context: z.string().optional(),
});

// Base entity schema with common properties
const baseEntitySchema = z.object({
  name: z.string(),
  type: z.string(),
  context: z.string(),
  mentions: z.array(mentionSchema),
  relationships: z.array(relationshipSchema).optional(),
});

// Person entity schema with specific fields
const personSchema = baseEntitySchema.extend({
  type: z.literal("PERSON"),
  role: z.string(),
  expertise: z.array(z.string()).optional(),
  affiliations: z.array(z.string()).optional(),
});

// Organization entity schema
const organizationSchema = baseEntitySchema.extend({
  type: z.literal("ORGANIZATION"),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().optional(),
});

// Location entity schema
const locationSchema = baseEntitySchema.extend({
  type: z.literal("LOCATION"),
  locationType: z.string().optional(),
  region: z.string().optional(),
});

// Event entity schema
const eventSchema = baseEntitySchema.extend({
  type: z.literal("EVENT"),
  date: z.string().optional(),
  duration: z.string().optional(),
  participants: z.array(z.string()).optional(),
});

// Topic entity schema
const topicSchema = baseEntitySchema.extend({
  type: z.literal("TOPIC"),
  relevance: z.number().optional(),
  subtopics: z.array(z.string()).optional(),
});

// Concept entity schema
const conceptSchema = baseEntitySchema.extend({
  type: z.literal("CONCEPT"),
  definition: z.string().optional(),
  examples: z.array(z.string()).optional(),
});

// Combined entities schema
export const podcastEntitiesSchema = z.object({
  people: z.array(personSchema),
  organizations: z.array(organizationSchema),
  locations: z.array(locationSchema),
  events: z.array(eventSchema),
  topics: z.array(topicSchema).optional(),
  concepts: z.array(conceptSchema).optional(),
});

// Export types
export type PodcastEntities = z.infer<typeof podcastEntitiesSchema>;
export type EntityMention = z.infer<typeof mentionSchema>;
export type EntityRelationship = z.infer<typeof relationshipSchema>;
export type PersonEntity = z.infer<typeof personSchema>;
export type OrganizationEntity = z.infer<typeof organizationSchema>;
export type LocationEntity = z.infer<typeof locationSchema>;
export type EventEntity = z.infer<typeof eventSchema>;
export type TopicEntity = z.infer<typeof topicSchema>;
export type ConceptEntity = z.infer<typeof conceptSchema>;
