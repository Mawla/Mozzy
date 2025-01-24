import { z } from "zod";
import { BaseEntity, EntityType, baseEntitySchema } from "./base";

// Post-specific entity interfaces
export interface PostPersonEntity extends BaseEntity {
  type: Extract<EntityType, "PERSON">;
  /** Professional title or role */
  title?: string;
  /** Organization affiliations */
  affiliations?: string[];
  /** Areas of expertise or topics associated with person */
  expertise: string[];
  /** Role of the person */
  role: string;
  /** Social media profiles */
  socialProfiles?: string[];
  /** Authored posts */
  authoredPosts?: string[];
}

export interface PostOrganizationEntity extends BaseEntity {
  type: Extract<EntityType, "ORGANIZATION">;
  /** Industry or sector */
  industry: string;
  /** Organization description */
  description?: string;
  /** Location of headquarters or main office */
  location?: string;
  /** Size of the organization */
  size: string;
  /** Website URL */
  website?: string;
  /** Social media profiles */
  socialProfiles?: string[];
}

export interface PostLocationEntity extends BaseEntity {
  type: Extract<EntityType, "LOCATION">;
  /** Type of location (e.g. city, country, landmark) */
  locationType: string;
  /** Geographic region */
  region?: string;
  /** Geographic coordinates */
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PostEventEntity extends BaseEntity {
  type: Extract<EntityType, "EVENT">;
  date?: string;
  duration?: string;
  participants?: string[];
  location?: string;
  url?: string;
}

export interface PostTopicEntity extends BaseEntity {
  type: Extract<EntityType, "TOPIC">;
  relevance?: number;
  subtopics?: string[];
  relatedPosts?: string[];
}

export interface PostConceptEntity extends BaseEntity {
  type: Extract<EntityType, "CONCEPT">;
  definition?: string;
  examples?: string[];
  relatedConcepts?: string[];
}

// Post-specific validation schemas
export const postPersonSchema = baseEntitySchema.extend({
  type: z.literal("PERSON"),
  title: z.string().optional(),
  affiliations: z.array(z.string()).optional(),
  expertise: z.array(z.string()),
  role: z.string(),
  socialProfiles: z.array(z.string()).optional(),
  authoredPosts: z.array(z.string()).optional(),
});

export const postOrganizationSchema = baseEntitySchema.extend({
  type: z.literal("ORGANIZATION"),
  industry: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  size: z.string(),
  website: z.string().optional(),
  socialProfiles: z.array(z.string()).optional(),
});

export const postLocationSchema = baseEntitySchema.extend({
  type: z.literal("LOCATION"),
  locationType: z.string().optional(),
  region: z.string().optional(),
  coordinates: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

export const postEventSchema = baseEntitySchema.extend({
  type: z.literal("EVENT"),
  date: z.string().optional(),
  duration: z.string().optional(),
  participants: z.array(z.string()).optional(),
  location: z.string().optional(),
  url: z.string().optional(),
});

export const postTopicSchema = baseEntitySchema.extend({
  type: z.literal("TOPIC"),
  relevance: z.number().optional(),
  subtopics: z.array(z.string()).optional(),
  relatedPosts: z.array(z.string()).optional(),
});

export const postConceptSchema = baseEntitySchema.extend({
  type: z.literal("CONCEPT"),
  definition: z.string().optional(),
  examples: z.array(z.string()).optional(),
  relatedConcepts: z.array(z.string()).optional(),
});

// Combined post entities schema
export const postEntitiesSchema = z.object({
  people: z.array(postPersonSchema),
  organizations: z.array(postOrganizationSchema),
  locations: z.array(postLocationSchema),
  events: z.array(postEventSchema),
  topics: z.array(postTopicSchema).optional(),
  concepts: z.array(postConceptSchema).optional(),
});

// Export validated types
export type ValidatedPostPerson = z.infer<typeof postPersonSchema>;
export type ValidatedPostOrganization = z.infer<typeof postOrganizationSchema>;
export type ValidatedPostLocation = z.infer<typeof postLocationSchema>;
export type ValidatedPostEvent = z.infer<typeof postEventSchema>;
export type ValidatedPostTopic = z.infer<typeof postTopicSchema>;
export type ValidatedPostConcept = z.infer<typeof postConceptSchema>;
export type ValidatedPostEntities = z.infer<typeof postEntitiesSchema>;
