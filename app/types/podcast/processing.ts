import type {
  ProcessingStatus,
  ProcessingAnalysis,
  BaseProcessingResult,
  BaseTextChunk,
  TimelineEvent,
  ProcessingMetadata,
  ProcessingState as BaseProcessingState,
  ProcessingStep as BaseProcessingStep,
  NetworkLog,
  ChunkResult,
  ProcessingOptions,
} from "@/app/core/processing/types/base";

import type {
  BaseEntity,
  EntityType,
  EntityMention,
  EntityRelationship,
} from "@/app/types/entities/base";

import type { PodcastAnalysis as BasePodcastAnalysis, Section } from "./models";

// Entity interfaces extending BaseEntity
export interface PersonEntity extends BaseEntity {
  type: Extract<EntityType, "PERSON">;
  expertise: string[];
  role: string;
}

export interface OrganizationEntity extends BaseEntity {
  type: Extract<EntityType, "ORGANIZATION">;
  industry: string;
  size: string;
}

export interface LocationEntity extends BaseEntity {
  type: Extract<EntityType, "LOCATION">;
  locationType: string;
  coordinates?: { lat: number; lng: number };
}

export interface EventEntity extends BaseEntity {
  type: Extract<EntityType, "EVENT">;
  date: string;
  duration: string;
  participants: string[];
}

export interface TopicEntity extends BaseEntity {
  type: Extract<EntityType, "TOPIC">;
  subtopics: string[];
  examples: string[];
}

export interface ConceptEntity extends BaseEntity {
  type: Extract<EntityType, "CONCEPT">;
  definition: string;
  examples: string[];
}

// Re-export the base types with sections
export interface PodcastAnalysis extends ProcessingAnalysis {
  sections?: Section[];
  themes?: string[];
}

// Re-export types
export type {
  EntityType,
  EntityMention,
  EntityRelationship,
  Section,
  ProcessingStatus,
  TimelineEvent,
  NetworkLog,
  ChunkResult,
  ProcessingOptions,
};

// Processing State Types
export interface ProcessingState extends BaseProcessingState {
  steps: Array<ProcessingStep>;
  chunks: ProcessingChunk[];
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: ProcessingStatus;
  progress?: number;
  error?: Error;
  description?: string;
  data?: any;
  chunks?: ProcessingChunk[];
  networkLogs?: NetworkLog[];
}

export interface TextChunk extends BaseTextChunk {
  // Add any podcast-specific fields here
}

export interface ProcessingChunk extends TextChunk {
  status: ProcessingStatus;
  response?: string;
  error?: Error;
  analysis?: PodcastAnalysis;
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  timeline?: TimelineEvent[];
}

export interface ProcessingChunkResult extends Omit<ChunkResult, "timeline"> {
  id: string;
  text: string;
  refinedText: string;
  analysis?: ProcessingAnalysis;
  entities: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
    topics: TopicEntity[];
    concepts: ConceptEntity[];
  };
  timeline?: TimelineEvent[];
  status: ProcessingStatus;
  progress: number;
  error?: Error;
}

export interface ProcessingResult extends BaseProcessingResult {
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
  quickFacts?: ProcessingAnalysis["quickFacts"];
  keyPoints?: ProcessingAnalysis["keyPoints"];
  themes?: string[];
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
  quickFacts?: ProcessingAnalysis["quickFacts"];
  keyPoints?: ProcessingAnalysis["keyPoints"];
  themes?: string[];
  people?: string[];
  organizations?: string[];
  locations?: string[];
  events?: string[];
  timeline?: TimelineEvent[];
};
