import { z } from "zod";
import { BaseEntity, EntityType, baseEntitySchema } from "./base";

// Person entity interface
export interface PersonEntity extends BaseEntity {
  type: Extract<EntityType, "PERSON">;
  role: string;
  expertise?: string[];
  affiliations?: string[];
}

// Organization entity interface
export interface OrganizationEntity extends BaseEntity {
  type: Extract<EntityType, "ORGANIZATION">;
  industry?: string;
  size?: string;
  location?: string;
}

// Location entity interface
export interface LocationEntity extends BaseEntity {
  type: Extract<EntityType, "LOCATION">;
  locationType?: string;
  region?: string;
}

// Event entity interface
export interface EventEntity extends BaseEntity {
  type: Extract<EntityType, "EVENT">;
  date?: string;
  duration?: string;
  participants?: string[];
}

// Topic entity interface
export interface TopicEntity extends BaseEntity {
  type: Extract<EntityType, "TOPIC">;
  relevance?: number;
  subtopics?: string[];
}

// Concept entity interface
export interface ConceptEntity extends BaseEntity {
  type: Extract<EntityType, "CONCEPT">;
  definition?: string;
  examples?: string[];
}

// Validation schemas
export const personSchema = baseEntitySchema.extend({
  type: z.literal("PERSON"),
  role: z.string(),
  expertise: z.array(z.string()).optional(),
  affiliations: z.array(z.string()).optional(),
});

export const organizationSchema = baseEntitySchema.extend({
  type: z.literal("ORGANIZATION"),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().optional(),
});

export const locationSchema = baseEntitySchema.extend({
  type: z.literal("LOCATION"),
  locationType: z.string().optional(),
  region: z.string().optional(),
});

export const eventSchema = baseEntitySchema.extend({
  type: z.literal("EVENT"),
  date: z.string().optional(),
  duration: z.string().optional(),
  participants: z.array(z.string()).optional(),
});

export const topicSchema = baseEntitySchema.extend({
  type: z.literal("TOPIC"),
  relevance: z.number().optional(),
  subtopics: z.array(z.string()).optional(),
});

export const conceptSchema = baseEntitySchema.extend({
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

// Export validated types
export type ValidatedPerson = z.infer<typeof personSchema>;
export type ValidatedOrganization = z.infer<typeof organizationSchema>;
export type ValidatedLocation = z.infer<typeof locationSchema>;
export type ValidatedEvent = z.infer<typeof eventSchema>;
export type ValidatedTopic = z.infer<typeof topicSchema>;
export type ValidatedConcept = z.infer<typeof conceptSchema>;
export type ValidatedPodcastEntities = z.infer<typeof podcastEntitiesSchema>;
