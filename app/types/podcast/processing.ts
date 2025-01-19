import type {
  ProcessingStatus,
  ProcessingAnalysis as BaseProcessingAnalysis,
  BaseProcessingResult,
  BaseTextChunk,
  TimelineEvent,
  ProcessingMetadata,
} from "@/app/core/processing/types";

import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  EntityMention,
  EntityRelationship,
} from "@/app/schemas/podcast/entities";

import type {
  PodcastAnalysis as BasePodcastAnalysis,
  PodcastEntities as BasePodcastEntities,
  Section,
  ProcessingStep,
} from "./models";

// Re-export the base types with sections
export interface PodcastAnalysis extends Omit<BasePodcastAnalysis, "sections"> {
  sections?: Section[];
}

// Re-export types
export type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  EntityMention,
  EntityRelationship,
  Section,
  ProcessingStatus,
  ProcessingStep,
  TimelineEvent,
};

// Processing State Types
export interface ProcessingState {
  status: ProcessingStatus;
  error?: Error;
  overallProgress: number;
  steps: Array<{
    id: string;
    name: string;
    description: string;
    status: ProcessingStatus;
    progress: number;
    error?: Error;
    chunks?: ProcessingChunk[];
    networkLogs?: NetworkLog[];
  }>;
  chunks: ProcessingChunk[];
  networkLogs: NetworkLog[];
  currentTranscript: string;
}

export interface TextChunk extends BaseTextChunk {
  // Add any podcast-specific fields here
}

export interface ProcessingChunk extends TextChunk {
  status: "pending" | "processing" | "completed" | "error";
  response?: string;
  error?: string;
  analysis?: PodcastAnalysis;
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  timeline?: TimelineEvent[];
}

export interface ProcessingChunkResult {
  entities: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  analysis: {
    summary: string;
    topics: string[];
    sentiment: string;
    keywords: string[];
    keyPoints?: Array<{
      title: string;
      description: string;
      relevance: string;
    }>;
    themes?: Array<{
      name: string;
      description: string;
      relatedConcepts: string[];
    }>;
  };
  timeline?: TimelineEvent[];
  refinedText?: string;
}

export interface ProcessingResult extends BaseProcessingResult {
  success: boolean;
  transcript: string;
  refinedTranscript: string;
  analysis: PodcastAnalysis;
  entities: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  timeline: TimelineEvent[];
}

export interface NetworkLog {
  timestamp: string;
  type: "request" | "response" | "error";
  message: string;
  data?: any;
}

// Analysis Types
export interface QuickFact {
  duration: string;
  participants: string[];
  recordingDate?: string;
  mainTopic: string;
  expertise: string;
}

export interface KeyPoint {
  title: string;
  description: string;
  relevance: string;
}

export interface Theme {
  name: string;
  description: string;
  relatedConcepts: string[];
}

export interface ChunkOptions {
  maxChunkSize?: number;
  overlap?: number;
  separator?: string;
}

export interface TranscriptStepData {
  refinedContent: string;
  chunks?: ProcessingChunk[];
  networkLogs?: NetworkLog[];
}

export interface AnalysisStepData {
  title?: string;
  summary?: string;
  quickFacts?: QuickFact;
  keyPoints?: KeyPoint[];
  themes?: Theme[];
}

export interface EntityStepData {
  people?: string[];
  organizations?: string[];
  locations?: string[];
  events?: string[];
}

export type StepData = {
  refinedContent?: string;
  chunks?: ProcessingChunk[];
  networkLogs?: NetworkLog[];
  title?: string;
  summary?: string;
  quickFacts?: QuickFact;
  keyPoints?: KeyPoint[];
  themes?: Theme[];
  people?: string[];
  organizations?: string[];
  locations?: string[];
  events?: string[];
  timeline?: TimelineEvent[];
};
