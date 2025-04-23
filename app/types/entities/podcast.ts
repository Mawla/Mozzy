import { z } from "zod";
import {
  BaseEntity,
  EntityType,
  baseEntitySchema,
  LocationEntity as BaseLocationEntity,
  LocationType,
  Coordinates,
  coordinatesSchema,
  locationEntitySchema as baseLocationSchema,
} from "./base";
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
  /** Required role of the person in the podcast context */
  role: string;
  /** Required areas of expertise */
  expertise: string[];
  /** Optional organizational affiliations */
  affiliations?: string[];
  /** Optional professional title */
  title?: string;
}

/**
 * Organization entity interface for podcast content.
 * Represents companies, institutions, or groups mentioned in podcasts.
 */
export interface OrganizationEntity extends BaseEntity {
  /** Must be ORGANIZATION type */
  type: Extract<EntityType, "ORGANIZATION">;
  /** Required industry classification */
  industry: string;
  /** Required organization size category */
  size: string;
  /** Optional physical location */
  location?: string;
  /** Optional detailed description */
  description?: string;
}

/**
 * Location entity interface for podcast content.
 * Extends base LocationEntity with podcast-specific fields.
 */
export interface LocationEntity extends BaseLocationEntity {
  /** Required type of location (city, country, etc.) */
  locationType: LocationType;
  /** Optional relevance score for this location in the podcast context (0-1) */
  relevance?: number;
  /** Optional timestamps where this location is mentioned */
  mentionTimestamps?: string[];
}

/**
 * Event entity interface for podcast content.
 * Represents events discussed in podcasts.
 */
export interface EventEntity extends BaseEntity {
  /** Must be EVENT type */
  type: Extract<EntityType, "EVENT">;
  /** Required event date (ISO format) */
  date: string;
  /** Required event duration */
  duration: string;
  /** Required list of event participants */
  participants: string[];
  /** Optional start date of the event */
  startDate?: string;
  /** Optional end date of the event */
  endDate?: string;
  /** Optional location of the event */
  location?: string;
  /** Optional type of event */
  eventType?: string;
}

/**
 * Topic entity interface for podcast content.
 * Represents main subjects discussed in podcasts.
 */
export interface TopicEntity extends BaseEntity {
  /** Must be TOPIC type */
  type: Extract<EntityType, "TOPIC">;
  /** Required topic relevance score (0-1) */
  relevance: number;
  /** Required related subtopics */
  subtopics: string[];
  /** Required topic category */
  category: string;
  /** Optional parent topics */
  parentTopics?: string[];
  /** Optional related keywords */
  keywords?: string[];
}

/**
 * Concept entity interface for podcast content.
 * Represents abstract ideas or theories discussed in podcasts.
 */
export interface ConceptEntity extends BaseEntity {
  /** Must be CONCEPT type */
  type: Extract<EntityType, "CONCEPT">;
  /** Required concept definition */
  definition: string;
  /** Required example usages of the concept */
  examples: string[];
  /** Required domain or field */
  domain: string;
  /** Optional related concepts */
  relatedConcepts?: string[];
}

// Person Entity Schema
export const personEntitySchema = baseEntitySchema.extend({
  type: z.literal("PERSON"),
  role: z.string().min(1),
  expertise: z.array(z.string()).min(1),
  affiliations: z.array(z.string()).optional(),
  title: z.string().optional(),
});

// Organization Entity Schema
export const organizationEntitySchema = baseEntitySchema.extend({
  type: z.literal("ORGANIZATION"),
  industry: z.string().min(1),
  size: z.string().min(1),
  location: z.string().optional(),
  description: z.string().optional(),
});

// Location Entity Schema
export const locationEntitySchema = baseLocationSchema.extend({
  relevance: z.number().min(0).max(1).optional(),
  mentionTimestamps: z.array(z.string()).optional(),
});

// Event Entity Schema
export const eventEntitySchema = baseEntitySchema.extend({
  type: z.literal("EVENT"),
  date: z.string(),
  duration: z.string(),
  participants: z.array(z.string()).min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  eventType: z.string().optional(),
});

// Topic Entity Schema
export const topicEntitySchema = baseEntitySchema.extend({
  type: z.literal("TOPIC"),
  relevance: z.number().min(0).max(1),
  subtopics: z.array(z.string()).min(1),
  category: z.string().min(1),
  parentTopics: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
});

// Concept Entity Schema
export const conceptEntitySchema = baseEntitySchema.extend({
  type: z.literal("CONCEPT"),
  definition: z.string().min(1),
  examples: z.array(z.string()).min(1),
  domain: z.string().min(1),
  relatedConcepts: z.array(z.string()).optional(),
});

// Combined entities schema
export const podcastEntitiesSchema = z.object({
  people: z.array(personEntitySchema),
  organizations: z.array(organizationEntitySchema),
  locations: z.array(locationEntitySchema),
  events: z.array(eventEntitySchema),
  topics: z.array(topicEntitySchema).optional(),
  concepts: z.array(conceptEntitySchema).optional(),
});

// Export validated types
export type ValidatedPodcastEntities = z.infer<typeof podcastEntitiesSchema>;

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
  /** Array of validated person entities */
  people: ValidatedPersonEntity[];
  /** Array of validated organization entities */
  organizations: ValidatedOrganizationEntity[];
  /** Array of validated location entities */
  locations: ValidatedLocationEntity[];
  /** Array of validated event entities */
  events: ValidatedEventEntity[];
  /** Array of validated topic entities */
  topics?: ValidatedTopicEntity[];
  /** Array of validated concept entities */
  concepts?: ValidatedConceptEntity[];
}
