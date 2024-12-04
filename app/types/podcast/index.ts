import {
  Theme,
  QA,
  Section,
  ContentAnalysis,
} from "@/app/schemas/podcast/analysis";

// Core types
export interface TimelineEvent {
  title: string;
  description: string;
  date: string;
  type: "milestone" | "event" | "decision";
  importance: "high" | "medium" | "low";
}

export interface QuickFacts {
  duration: string;
  participants: string[];
  mainTopic: string;
  expertise: string;
}

export interface ProcessedPodcast extends Omit<ContentAnalysis, "themes"> {
  id: string;
  people: string[];
  organizations: string[];
  locations: string[];
  events: string[];
  timeline: TimelineEvent[];
  themes: Theme[];
}

// Processing types
export interface TextChunk {
  id: number;
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface ChunkOptions {
  maxLength?: number;
  overlap?: number;
}

export interface ChunkResult {
  id: number;
  refinedText: string;
  analysis: PodcastAnalysis;
  entities: PodcastEntities;
  timeline: TimelineEvent[];
}

export interface ProcessingResult {
  transcript: string;
  refinedTranscript: string;
  analysis: PodcastAnalysis;
  entities: PodcastEntities;
  timeline: TimelineEvent[];
}

export interface ProcessingStep {
  name: string;
  status: "idle" | "processing" | "completed" | "error";
  data: any;
  dependsOn?: string[];
}

// Entity types
export interface EntityMention {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  timestamp?: string;
}

export interface EntityRelationship {
  entity: string;
  relationship: string;
  context?: string;
}

export interface EntityDetails {
  name: string;
  type: string;
  context: string;
  mentions: EntityMention[];
  relationships?: EntityRelationship[];
}

export interface PodcastEntities {
  people: EntityDetails[];
  organizations: EntityDetails[];
  locations: EntityDetails[];
  events: EntityDetails[];
  topics?: EntityDetails[];
  concepts?: EntityDetails[];
}

// Analysis types
export interface PodcastAnalysis extends ContentAnalysis {
  id: string;
}

// Base podcast type
export interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  duration?: string;
  status: "processing" | "completed" | "error";
  analysis?: {
    keyPoints: string[];
    summary: string;
  };
}
