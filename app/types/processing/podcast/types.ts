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
  ProcessingChunk as BaseChunk,
} from "../base";

import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
} from "../../entities/podcast";

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
} from "../../shared/podcast";

// Processing State Types
export interface ProcessingStep extends BaseProcessingStep {
  /** Additional data for the step */
  data?: any;
  /** Processing chunks */
  chunks?: PodcastProcessingChunk[];
}

export interface ProcessingState extends BaseProcessingState {
  /** Processing steps */
  steps: ProcessingStep[];
  /** Processing chunks */
  chunks: PodcastProcessingChunk[];
}

export interface TextChunk extends BaseTextChunk {
  // Add any podcast-specific fields here
}

export interface ProcessingChunk extends TextChunk {
  status: ProcessingStatus;
  response?: string;
  error?: Error;
  result?: ProcessingChunkResult;
  analysis?: PodcastAnalysis;
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  timeline?: TimelineEvent[];
}

export interface ProcessingChunkResult
  extends Omit<ChunkResult, "timeline" | "entities"> {
  /** Unique identifier */
  id: string;
  /** Original text content */
  text: string;
  /** Refined/processed text */
  refinedText: string;
  /** Analysis results */
  analysis?: ProcessingAnalysis;
  /** Extracted entities */
  entities: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
    topics: TopicEntity[];
    concepts: ConceptEntity[];
  };
  /** Timeline events */
  timeline?: TimelineEvent[];
  /** Processing status */
  status: ProcessingStatus;
  /** Progress percentage (0-100) */
  progress: number;
  /** Error if any occurred */
  error?: Error;
}

export interface ProcessingResult extends BaseProcessingResult {
  /** Refined/processed transcript */
  refinedTranscript: string;
  /** Analysis results */
  analysis: PodcastAnalysis;
  /** Extracted entities */
  entities: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
    topics?: TopicEntity[];
    concepts?: ConceptEntity[];
  };
  /** Timeline events */
  timeline: TimelineEvent[];
}

// Podcast-specific analysis type
export interface PodcastAnalysis
  extends Omit<ProcessingAnalysis, "sections" | "themes"> {
  sections: Section[];
  themes: string[];
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

export interface PodcastProcessingStep extends BaseProcessingStep {
  /** Processing chunks */
  chunks?: PodcastProcessingChunk[];
  /** Transcript ID if available */
  transcriptId?: string;
  /** Additional podcast-specific step data */
  podcastData?: {
    duration?: string;
    speakers?: string[];
    topics?: string[];
  };
}

export interface PodcastProcessingChunk extends BaseChunk {
  /** Processing status of the chunk */
  status: ProcessingStatus;
  /** Response from processing */
  response?: string;
  /** Any error that occurred */
  error?: Error;
  /** Processing result */
  result?: ProcessingChunkResult;
  /** Analysis data */
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
  /** Speaker identification */
  speaker?: string;
  /** Progress percentage (0-100) */
  progress: number;
}
