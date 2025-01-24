import type { ProcessingStatus } from "../base";
import type {
  ProcessingAnalysis,
  ProcessingResult as BaseProcessingResult,
  BaseTextChunk,
  TimelineEvent,
  ProcessingMetadata,
  ProcessingState as BaseProcessingState,
  ProcessingStep as BaseProcessingStep,
  NetworkLog,
  ChunkResult,
  ProcessingOptions,
  ProcessingChunk as BaseProcessingChunk,
  SentimentAnalysis,
  TopicAnalysis,
} from "../types";

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
} from "../../shared/podcast";

import type { ValidatedPodcastEntities } from "../../entities/podcast";

// Re-export imported types
export type {
  PodcastInput,
  PodcastTranscript,
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  Section,
  ContentSection,
  Concept,
  Argument,
  Controversy,
  Quote,
  Application,
};

// Processing State Types
export interface ProcessingStep extends BaseProcessingStep {
  /** Additional data for the step */
  data?: StepData;
  /** Processing chunks */
  chunks?: PodcastProcessingChunk[];
  /** Progress percentage (0-100) */
  progress: number;
}

export interface ProcessingState extends BaseProcessingState {
  /** Processing steps */
  steps: ProcessingStep[];
  /** Processing chunks */
  chunks: PodcastProcessingChunk[];
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

export interface ProcessingChunkResult extends ChunkResult {
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
  /** Progress percentage (0-100) */
  progress: number;
}

// Podcast-specific analysis type
export interface PodcastAnalysis extends ProcessingAnalysis {
  /** Content sections */
  sections: Section[];
  /** Key themes */
  themes: string[];
}

export interface QuickFact {
  /** Duration of the podcast */
  duration: string;
  /** List of participants */
  participants: string[];
  /** Recording date if available */
  recordingDate?: string;
  /** Main topic discussed */
  mainTopic: string;
  /** Required expertise level */
  expertise: string;
}

export interface KeyPoint {
  /** Title of the key point */
  title: string;
  /** Detailed description */
  description: string;
  /** Relevance score (0-1) */
  relevance: string;
}

export interface ChunkOptions {
  /** Maximum size of each chunk */
  maxChunkSize?: number;
  /** Overlap between chunks */
  overlap?: number;
  /** Chunk separator */
  separator?: string;
}

export interface TranscriptStepData {
  /** Refined content after processing */
  refinedContent: string;
  /** Processing chunks */
  chunks?: ProcessingChunk[];
  /** Network logs */
  networkLogs?: NetworkLog[];
}

export interface AnalysisStepData {
  /** Title extracted from analysis */
  title?: string;
  /** Summary of content */
  summary?: string;
  /** Quick facts about the podcast */
  quickFacts?: ProcessingAnalysis["quickFacts"];
  /** Key points extracted */
  keyPoints?: ProcessingAnalysis["keyPoints"];
  /** Key themes identified */
  themes?: string[];
}

export interface EntityStepData {
  /** Extracted people */
  people?: string[];
  /** Extracted organizations */
  organizations?: string[];
  /** Extracted locations */
  locations?: string[];
  /** Extracted events */
  events?: string[];
}

export type StepData = {
  /** Refined content */
  refinedContent?: string;
  /** Processing chunks */
  chunks?: ProcessingChunk[];
  /** Network logs */
  networkLogs?: NetworkLog[];
  /** Title */
  title?: string;
  /** Summary */
  summary?: string;
  /** Quick facts */
  quickFacts?: ProcessingAnalysis["quickFacts"];
  /** Key points */
  keyPoints?: ProcessingAnalysis["keyPoints"];
  /** Themes */
  themes?: string[];
  /** People */
  people?: string[];
  /** Organizations */
  organizations?: string[];
  /** Locations */
  locations?: string[];
  /** Events */
  events?: string[];
  /** Timeline */
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
  /** Progress percentage (0-100) */
  progress: number;
}

export interface PodcastProcessingChunk extends BaseProcessingChunk {
  /** Unique chunk ID */
  id: string;
  /** The text content of the chunk */
  text: string;
  /** Processing status */
  status: ProcessingStatus;
  /** Processing progress (0-100) */
  progress: number;
  /** Start time in audio (if applicable) */
  start?: number;
  /** End time in audio (if applicable) */
  end?: number;
  /** Start index in text */
  startIndex?: number;
  /** End index in text */
  endIndex?: number;
  /** Processing result */
  result?: ChunkResult;
}

/**
 * Podcast processing state
 */
export interface PodcastProcessingState extends BaseProcessingState {
  /** Processing steps */
  steps: PodcastProcessingStep[];
  /** Current chunks */
  chunks: PodcastProcessingChunk[];
  /** Current transcript */
  currentTranscript: string;
  /** Progress percentage (0-100) */
  progress: number;
}

/**
 * Fully processed podcast with analysis
 */
export interface ProcessedPodcast {
  /** Unique identifier */
  id: string;
  /** Podcast title */
  title: string;
  /** Summary */
  summary: string;
  /** Full transcript */
  transcript: string;
  /** Analysis results */
  analysis: {
    /** Key themes */
    themes?: string[];
    /** Sentiment analysis */
    sentiment?: SentimentAnalysis;
    /** Topic analysis */
    topics?: TopicAnalysis[];
    /** Quick facts */
    quickFacts?: {
      duration: string;
      participants: string[];
      recordingDate?: string;
      mainTopic: string;
      expertise: string;
    };
  };
  /** Extracted entities */
  entities: ValidatedPodcastEntities;
  /** Timeline of events */
  timeline: TimelineEvent[];
}
