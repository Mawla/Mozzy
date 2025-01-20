import { z } from "zod";
import { BaseEntity, EntityType, baseEntitySchema } from "./base";

/**
 * Person entity interface for podcast content.
 * Represents individuals mentioned or speaking in podcasts.
 */
export interface PersonEntity extends BaseEntity {
  /** Must be PERSON type */
  type: Extract<EntityType, "PERSON">;
  /** Role of the person in the podcast context */
  role: string;
  /** Areas of expertise (optional) */
  expertise?: string[];
  /** Organizational affiliations (optional) */
  affiliations?: string[];
}

/**
 * Organization entity interface for podcast content.
 * Represents companies, institutions, or groups mentioned in podcasts.
 */
export interface OrganizationEntity extends BaseEntity {
  /** Must be ORGANIZATION type */
  type: Extract<EntityType, "ORGANIZATION">;
  /** Industry classification (optional) */
  industry?: string;
  /** Organization size category (optional) */
  size?: string;
  /** Physical location (optional) */
  location?: string;
}

/**
 * Location entity interface for podcast content.
 * Represents physical places mentioned in podcasts.
 */
export interface LocationEntity extends BaseEntity {
  /** Must be LOCATION type */
  type: Extract<EntityType, "LOCATION">;
  /** Type of location (e.g., city, country) */
  locationType?: string;
  /** Geographic region (optional) */
  region?: string;
}

/**
 * Event entity interface for podcast content.
 * Represents events discussed in podcasts.
 */
export interface EventEntity extends BaseEntity {
  /** Must be EVENT type */
  type: Extract<EntityType, "EVENT">;
  /** Event date (ISO format) */
  date?: string;
  /** Event duration (optional) */
  duration?: string;
  /** List of event participants (optional) */
  participants?: string[];
}

/**
 * Topic entity interface for podcast content.
 * Represents main subjects discussed in podcasts.
 */
export interface TopicEntity extends BaseEntity {
  /** Must be TOPIC type */
  type: Extract<EntityType, "TOPIC">;
  /** Topic relevance score (0-1) */
  relevance?: number;
  /** Related subtopics (optional) */
  subtopics?: string[];
}

/**
 * Concept entity interface for podcast content.
 * Represents abstract ideas or theories discussed in podcasts.
 */
export interface ConceptEntity extends BaseEntity {
  /** Must be CONCEPT type */
  type: Extract<EntityType, "CONCEPT">;
  /** Concept definition */
  definition?: string;
  /** Example usages of the concept */
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
