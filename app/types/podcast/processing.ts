import type { ProcessingStatus } from "@/app/types/processing/base";
import type {
  ProcessingResult as BaseProcessingResult,
  ProcessingStep as BaseProcessingStep,
  ProcessingState as BaseProcessingState,
  ProcessingChunk as BaseProcessingChunk,
  NetworkLog,
  ChunkResult,
  ProcessingOptions,
  ProcessingAnalysis,
  TimelineEvent,
  ProcessingMetadata,
  SentimentAnalysis,
  TopicAnalysis,
  TextChunk as BaseTextChunk,
} from "@/app/types/processing/types";

import type {
  BaseEntity,
  EntityType,
  EntityMention,
  EntityRelationship,
  PersonEntity as BasePersonEntity,
  OrganizationEntity as BaseOrganizationEntity,
  LocationEntity as BaseLocationEntity,
  EventEntity as BaseEventEntity,
  TopicEntity as BaseTopicEntity,
  ConceptEntity as BaseConceptEntity,
} from "@/app/types/entities/base";

import type {
  Section,
  ContentSection,
  Concept,
  Argument,
  Controversy,
  Quote,
  Application,
  PodcastInput,
  PodcastTranscript,
  ProcessedPodcast,
} from "./shared";

// Re-export types from shared
export type {
  Section,
  ContentSection,
  Concept,
  Argument,
  Controversy,
  Quote,
  Application,
  PodcastInput,
  PodcastTranscript,
  ProcessedPodcast,
};

// Podcast-specific entity types
export interface PersonEntity extends BasePersonEntity {
  expertise: string[];
  role: string;
}

export interface OrganizationEntity extends BaseOrganizationEntity {
  industry: string;
  size: string;
}

export interface LocationEntity extends BaseLocationEntity {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface EventEntity extends BaseEventEntity {
  date: string;
  duration: string;
  participants: string[];
}

export interface TopicEntity extends BaseTopicEntity {
  subtopics: string[];
  examples: string[];
}

export interface ConceptEntity extends BaseConceptEntity {
  examples: string[];
}

// Re-export the base types with sections
export interface PodcastAnalysis extends ProcessingAnalysis {
  sections?: Section[];
  themes?: string[];
}

// Re-export types
export type { EntityType, EntityMention, EntityRelationship };

// Processing State Types
export interface ProcessingStep extends BaseProcessingStep {
  /** Additional data for the step */
  data?: StepData;
  /** Processing chunks */
  chunks?: ProcessingChunk[];
  /** Progress percentage (0-100) */
  progress: number;
}

export interface ProcessingState extends BaseProcessingState {
  /** Processing steps */
  steps: ProcessingStep[];
  /** Processing chunks */
  chunks: ProcessingChunk[];
  /** Progress percentage (0-100) */
  progress: number;
}

export interface TextChunk extends BaseTextChunk {
  /** Progress percentage (0-100) */
  progress: number;
}

export interface ProcessingChunk extends TextChunk {
  /** Processing status */
  status: ProcessingStatus;
  /** Response from processing */
  response?: string;
  /** Error if any occurred */
  error?: Error;
  /** Processing result */
  result?: ProcessingChunkResult;
  /** Analysis results */
  analysis?: PodcastAnalysis;
  /** Extracted entities */
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  /** Timeline events */
  timeline?: TimelineEvent[];
  /** Progress percentage (0-100) */
  progress: number;
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
