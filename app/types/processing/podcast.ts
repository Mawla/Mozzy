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
  ProcessingState,
  ProcessingStep,
  NetworkLog,
  BaseProcessingResult,
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

export interface PodcastProcessingResult extends BaseProcessingResult {
  format: Extract<ProcessingFormat, "podcast">;
  analysis: PodcastProcessingAnalysis;
  entities: ValidatedPodcastEntities;
  timeline: TimelineEvent[];
}

export interface PodcastProcessingState extends ProcessingState {
  chunks: PodcastProcessingChunk[];
}

export interface PodcastProcessingStep extends ProcessingStep {
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
export interface PodcastAnalysis extends BasePodcastAnalysis {
  /** Quick facts extracted from the podcast */
  quickFacts: {
    /** Duration of the episode */
    duration: string;
    /** List of participants in the podcast */
    participants: string[];
    /** When the podcast was recorded */
    recordingDate?: string;
    /** Main topic discussed */
    mainTopic: string;
    /** Level of expertise required to understand */
    expertise: string;
  };
  /** Key points from the podcast */
  keyPoints: Array<{
    /** Title of the key point */
    title: string;
    /** Detailed description */
    description: string;
    /** Relevance or importance */
    relevance: string;
  }>;
  /** Major themes discussed with extended information */
  themes: string[];
  extendedThemes: ExtendedTheme[];
  /** Content sections */
  sections: Section[];
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
