import { z } from "zod";
import { BaseEntity, EntityType, baseEntitySchema } from "./base";
import { ContentMetadata } from "@/app/types/contentMetadata";
import { ProcessingStatus } from "../processing/base";
import { PodcastAnalysis } from "../processing/podcast";

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
  /** Type of location (e.g., city, country) - Required */
  locationType: string;
  /** Geographic region (optional) */
  region?: string;
  /** Geographic coordinates (optional) */
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Event entity interface for podcast content.
 * Represents events discussed in podcasts.
 */
export interface EventEntity extends BaseEntity {
  /** Must be EVENT type */
  type: Extract<EntityType, "EVENT">;
  /** Event date (ISO format) */
  date: string;
  /** Event duration */
  duration: string;
  /** List of event participants */
  participants: string[];
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
  role: z.string().min(1),
  expertise: z.array(z.string()).min(1),
  affiliations: z.array(z.string()).optional(),
});

export const organizationSchema = baseEntitySchema.extend({
  type: z.literal("ORGANIZATION"),
  industry: z.string().min(1),
  size: z.string().min(1),
  location: z.string().optional(),
});

export const eventSchema = baseEntitySchema.extend({
  type: z.literal("EVENT"),
  date: z.string(),
  duration: z.string(),
  participants: z.array(z.string()),
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

// Location Entity Schema
export const locationEntitySchema = baseEntitySchema.extend({
  type: z.literal("LOCATION"),
  locationType: z.string().min(1),
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
  region: z.string().optional(),
});

// Combined entities schema
export const podcastEntitiesSchema = z.object({
  people: z.array(personSchema),
  organizations: z.array(organizationSchema),
  locations: z.array(locationEntitySchema),
  events: z.array(eventSchema),
  topics: z.array(topicSchema).optional(),
  concepts: z.array(conceptSchema).optional(),
});

// Export validated types
export type ValidatedPerson = z.infer<typeof personSchema>;
export type ValidatedOrganization = z.infer<typeof organizationSchema>;
export type ValidatedLocation = z.infer<typeof locationEntitySchema>;
export type ValidatedEvent = z.infer<typeof eventSchema>;
export type ValidatedTopic = z.infer<typeof topicSchema>;
export type ValidatedConcept = z.infer<typeof conceptSchema>;
export type ValidatedPodcastEntities = z.infer<typeof podcastEntitiesSchema>;

// Person Entity Schema
export const personEntitySchema = baseEntitySchema.extend({
  type: z.literal("PERSON"),
  expertise: z.array(z.string()).min(1),
  role: z.string().min(1),
});

// Organization Entity Schema
export const organizationEntitySchema = baseEntitySchema.extend({
  type: z.literal("ORGANIZATION"),
  industry: z.string().min(1),
  size: z.string().min(1),
});

// Event Entity Schema
export const eventEntitySchema = baseEntitySchema.extend({
  type: z.literal("EVENT"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  duration: z.string().min(1),
  participants: z.array(z.string()).min(1),
});

// Topic Entity Schema
export const topicEntitySchema = baseEntitySchema.extend({
  type: z.literal("TOPIC"),
  subtopics: z.array(z.string()).min(1),
  examples: z.array(z.string()).min(1),
});

// Concept Entity Schema
export const conceptEntitySchema = baseEntitySchema.extend({
  type: z.literal("CONCEPT"),
  definition: z.string().min(1),
  examples: z.array(z.string()).min(1),
});

// Export type helpers
export type ValidatedPersonEntity = z.infer<typeof personEntitySchema>;
export type ValidatedOrganizationEntity = z.infer<
  typeof organizationEntitySchema
>;
export type ValidatedLocationEntity = z.infer<typeof locationEntitySchema>;
export type ValidatedEventEntity = z.infer<typeof eventEntitySchema>;
export type ValidatedTopicEntity = z.infer<typeof topicEntitySchema>;
export type ValidatedConceptEntity = z.infer<typeof conceptEntitySchema>;

// Combined entity schema for validation
export const podcastEntitySchema = z.discriminatedUnion("type", [
  personEntitySchema,
  organizationEntitySchema,
  locationEntitySchema,
  eventEntitySchema,
  topicEntitySchema,
  conceptEntitySchema,
]);

export type ValidatedPodcastEntity = z.infer<typeof podcastEntitySchema>;

/**
 * Core Podcast entity interface
 * Represents a podcast with its metadata, analysis, and processing status
 */
export interface Podcast {
  /** Unique identifier for the podcast */
  id: string;
  /** Title of the podcast episode */
  title: string;
  /** Brief summary of the podcast content */
  summary: string;
  /** Original unprocessed transcript */
  originalTranscript: string;
  /** Cleaned and processed transcript */
  cleanTranscript: string;
  /** Duration of the podcast episode */
  duration?: string;
  /** Date when the podcast was recorded */
  recordingDate?: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Additional metadata about the content */
  metadata: ContentMetadata;
  /** Detailed analysis of the podcast content */
  analysis: PodcastAnalysis;
  /** Current processing status */
  status: ProcessingStatus;
}

/**
 * Represents entities extracted from podcast content
 * Used for organizing and categorizing mentioned entities
 */
export interface PodcastEntities {
  /** Array of people mentioned in the podcast */
  people: string[];
  /** Array of organizations mentioned */
  organizations: string[];
  /** Array of locations referenced */
  locations: string[];
  /** Array of events discussed */
  events: string[];
}
