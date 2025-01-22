import type {
  ProcessingFormat,
  ProcessingQuality,
  ProcessingStatus,
  TimelineEvent,
  SentimentAnalysis,
  TopicAnalysis,
  ProcessingOptions,
  ProcessingMetadata,
  BaseTextChunk,
  ProcessingState as BaseProcessingState,
  ProcessingStep as BaseProcessingStep,
  NetworkLog,
  BaseProcessingResult,
  ProcessingAnalysis,
  ChunkResult,
} from "./base";

import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities/podcast";

import { Section } from "../shared/content";

import type {
  ContentSection,
  Concept,
  Argument,
  Controversy,
  Quote,
  Application,
  PodcastInput,
  PodcastTranscript,
  ProcessedPodcast,
} from "../podcast/shared";

// Re-export shared types
export type {
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

// Re-export entity types
export type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
} from "../entities/podcast";

/**
 * Represents a theme discussed in the podcast with extended information
 */
export interface ExtendedTheme {
  /** Theme name - matches the string in base themes array */
  name: string;
  /** Theme description */
  description: string;
  /** Related concepts */
  relatedConcepts: string[];
}

/**
 * Base interface for podcast processing analysis
 */
export interface BasePodcastAnalysis {
  /** Unique identifier for the analysis */
  id?: string;
  /** Title of the analyzed content */
  title?: string;
  /** Brief summary of the content */
  summary?: string;
  /** Extracted entities */
  entities?: ValidatedPodcastEntities;
  /** Timeline of events */
  timeline?: TimelineEvent[];
  /** Sentiment analysis results */
  sentiment?: SentimentAnalysis;
  /** Topic analysis results */
  topics?: TopicAnalysis[];
  /** Major themes discussed - basic theme names */
  themes?: string[];
  /** Extended theme information */
  extendedThemes?: ExtendedTheme[];
}

export interface PodcastProcessingAnalysis extends BasePodcastAnalysis {
  id?: string;
  title?: string;
  summary?: string;
  entities?: ValidatedPodcastEntities;
  timeline?: TimelineEvent[];
  sentiment?: SentimentAnalysis;
  topics?: TopicAnalysis[];
  themes?: string[];
  keyPoints?: Array<{
    title: string;
    description: string;
    relevance: string;
  }>;
  quickFacts?: {
    duration: string;
    participants: string[];
    recordingDate?: string;
    mainTopic: string;
    expertise: string;
  };
}

export interface PodcastChunkResult {
  id: string;
  text: string;
  refinedText: string;
  analysis?: PodcastProcessingAnalysis;
  entities: ValidatedPodcastEntities;
  timeline: TimelineEvent[];
}

export type PodcastProcessingChunk = BaseTextChunk & {
  status: ProcessingStatus;
  result?: PodcastChunkResult;
};

/**
 * Complete result of podcast processing operation.
 * Extends base processing result with podcast-specific outputs
 * including transcription, speaker analysis, and entity extraction.
 */
export interface PodcastProcessingResult extends BaseProcessingResult {
  /** Content format identifier */
  format: "podcast";
  /** Original transcript text */
  transcript: string;
  /** Refined and cleaned transcript */
  refinedTranscript: string;
  /** Detailed podcast analysis results */
  analysis: PodcastAnalysis;
  /** Processed transcription chunks */
  chunks: PodcastTextChunk[];
  /** List of identified speakers */
  speakers: string[];
  /** Chronological event timeline */
  timeline: TimelineEvent[];
  /** Extracted entities from transcription */
  entities: {
    /** People mentioned in the podcast */
    people: PersonEntity[];
    /** Organizations discussed */
    organizations: OrganizationEntity[];
    /** Locations referenced */
    locations: LocationEntity[];
    /** Events mentioned */
    events: EventEntity[];
  };
  /** Current processing status */
  status: ProcessingStatus;
}

/**
 * Represents a chunk of processed podcast audio transcription.
 * Includes speaker and confidence information.
 */
export interface PodcastTextChunk {
  /** Unique chunk identifier */
  id: string;
  /** Transcribed text content */
  text: string;
  /** Identified speaker for this chunk */
  speaker?: string;
  /** Transcription confidence score (0-1) */
  confidence?: number;
  /** Start time in seconds */
  startTime?: number;
  /** End time in seconds */
  endTime?: number;
  /** Processing status of the chunk */
  status: ProcessingStatus;
}

export interface PodcastProcessingState extends BaseProcessingState {
  chunks: PodcastProcessingChunk[];
}

export interface PodcastProcessingStep extends BaseProcessingStep {
  chunks?: PodcastProcessingChunk[];
  data?: {
    entities?: ValidatedPodcastEntities;
    analysis?: PodcastProcessingAnalysis;
    refinedContent?: string;
    timeline?: TimelineEvent[];
  };
}

/**
 * Represents the analysis of a podcast episode
 * Contains detailed breakdown of content and insights
 */
export interface PodcastAnalysis
  extends Omit<ProcessingAnalysis, "sections" | "themes"> {
  sections: Section[];
  themes: string[];
}

/**
 * Input data for podcast processing
 */
export interface PodcastInput {
  /** Type of input source */
  type: "url" | "search" | "transcript";
  /** The actual content to process */
  content: string;
}

/**
 * Result of podcast processing operation
 */
export interface PodcastProcessingResultBase {
  /** Whether processing was successful */
  success: boolean;
  /** ID of the processed podcast */
  podcastId?: string;
  /** Error message if processing failed */
  error?: string;
}

/**
 * Represents a processed podcast transcript
 */
export interface PodcastTranscript {
  /** Refined and cleaned transcript content */
  refinedContent: string;
}

/**
 * Represents a fully processed podcast with validated entities
 */
export interface ProcessedPodcast {
  /** Unique identifier */
  id: string;
  /** Processed transcript */
  transcript: PodcastTranscript;
  /** Analysis results */
  analysis: {
    /** Brief summary */
    summary: string;
    /** Key points extracted */
    keyPoints: string[];
    /** Main topics discussed */
    topics: TopicAnalysis[];
    /** Extracted entities */
    entities: ValidatedPodcastEntities;
    /** Timeline of events */
    timeline: TimelineEvent[];
  };
  /** Processing status */
  status: ProcessingStatus;
  /** Error message if processing failed */
  error?: string;
}

/**
 * State management interface for podcast processing
 */
export interface PodcastProcessingStateManagement {
  /** Whether processing is active */
  isProcessing: boolean;
  /** Input data being processed */
  inputData: PodcastInput | null;
  /** Array of processing steps */
  processingSteps: ProcessingStep[];
  /** Currently processed podcast */
  currentPodcast: ProcessedPodcast | null;
  /** Set processing state */
  setProcessing: (isProcessing: boolean) => void;
  /** Set input data */
  setInputData: (data: PodcastInput | null) => void;
  /** Update status of a processing step */
  updateStepStatus: (
    stepName: string,
    status: ProcessingStep["status"],
    data?: any
  ) => void;
  /** Process a single step */
  processStep: (step: ProcessingStep) => Promise<boolean>;
  /** Handle podcast submission */
  handlePodcastSubmit: (data: PodcastInput) => Promise<void>;
  /** Retry a failed step */
  handleRetryStep: (stepName: string) => Promise<void>;
  /** Reset processing state */
  reset: () => void;
}

// Processing State Types
export interface ProcessingStep extends BaseProcessingStep {
  id: string;
  name: string;
  status: ProcessingStatus;
  progress: number;
  error?: Error;
  description?: string;
  data?: any;
  chunks?: ProcessingChunk[];
  networkLogs?: NetworkLog[];
}

export interface ProcessingState extends BaseProcessingState {
  steps: ProcessingStep[];
  chunks: ProcessingChunk[];
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
