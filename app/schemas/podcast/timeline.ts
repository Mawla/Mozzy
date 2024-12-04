import { z } from "zod";

// Reference schema for linking to other entities
const entityReferenceSchema = z.object({
  id: z.string(),
  type: z.enum([
    "PERSON",
    "ORGANIZATION",
    "LOCATION",
    "EVENT",
    "TOPIC",
    "CONCEPT",
  ]),
  name: z.string(),
});

// Time point schema for precise temporal information
const timePointSchema = z.object({
  timestamp: z.string(), // ISO string or relative timestamp
  confidence: z.number().min(0).max(1), // Confidence in the timestamp accuracy
  isApproximate: z.boolean(),
  timeContext: z.string().optional(), // Additional context about the time
});

// Timeline event schema
export const timelineEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum([
    "STATEMENT", // Direct quotes or statements
    "ACTION", // Actions or events described
    "REFERENCE", // References to past/future events
    "INTERACTION", // Interactions between entities
    "TRANSITION", // Topic or speaker transitions
    "REVELATION", // New information or insights
  ]),
  time: timePointSchema,
  duration: z.string().optional(), // Duration if applicable
  confidence: z.number().min(0).max(1), // Confidence in event detection

  // Entity references
  participants: z.array(entityReferenceSchema),
  locations: z.array(entityReferenceSchema).optional(),
  organizations: z.array(entityReferenceSchema).optional(),
  topics: z.array(entityReferenceSchema).optional(),

  // Context
  context: z.string(),
  quotes: z.array(z.string()).optional(),
  sentiment: z.enum(["positive", "negative", "neutral"]).optional(),

  // Relationships
  causedBy: z.array(z.string()).optional(), // IDs of events that caused this
  leadsTo: z.array(z.string()).optional(), // IDs of events this leads to
  relatedEvents: z.array(z.string()).optional(), // IDs of related events

  // Source
  sourceText: z.string(), // Original text that generated this event
  sourceParagraph: z.string(), // Broader context paragraph
  sourceConfidence: z.number().min(0).max(1), // Confidence in source accuracy
});

// Timeline segment schema for grouping events
export const timelineSegmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  startTime: timePointSchema,
  endTime: timePointSchema,
  events: z.array(timelineEventSchema),
  mainTopics: z.array(entityReferenceSchema).optional(),
  mainParticipants: z.array(entityReferenceSchema).optional(),
  summary: z.string(),
});

// Complete timeline schema
export const podcastTimelineSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  segments: z.array(timelineSegmentSchema),
  events: z.array(timelineEventSchema),
  startTime: timePointSchema,
  endTime: timePointSchema,
  duration: z.string(),
  mainParticipants: z.array(entityReferenceSchema),
  mainTopics: z.array(entityReferenceSchema),
  summary: z.string(),
});

// Export types
export type EntityReference = z.infer<typeof entityReferenceSchema>;
export type TimePoint = z.infer<typeof timePointSchema>;
export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type TimelineSegment = z.infer<typeof timelineSegmentSchema>;
export type PodcastTimeline = z.infer<typeof podcastTimelineSchema>;
