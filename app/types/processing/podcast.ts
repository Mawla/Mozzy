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

export interface PodcastProcessingAnalysis {
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
export interface PodcastAnalysis {
  /** Unique identifier for the analysis */
  id: string;
  /** Title of the analyzed podcast */
  title: string;
  /** Brief summary of the podcast content */
  summary: string;
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
  /** Major themes discussed */
  themes: Array<{
    /** Theme name */
    name: string;
    /** Theme description */
    description: string;
    /** Related concepts */
    relatedConcepts: string[];
  }>;
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
export interface ProcessingResult {
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
 * Represents a fully processed podcast
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
    topics: string[];
    /** Extracted entities */
    entities: {
      /** People mentioned */
      people: string[];
      /** Places referenced */
      places: string[];
      /** Organizations discussed */
      organizations: string[];
    };
    /** Timeline of events */
    timeline: Array<{
      /** Timestamp in the podcast */
      timestamp: string;
      /** Content at this timestamp */
      content: string;
    }>;
  };
  /** Processing status */
  status: "processing" | "completed" | "error";
  /** Error message if processing failed */
  error?: string;
}

/**
 * State management interface for podcast processing
 */
export interface PodcastProcessingState {
  /** Whether processing is active */
  isProcessing: boolean;
  /** Input data being processed */
  inputData: PodcastInput | null;
  /** Array of processing steps */
  processingSteps: ProcessingStep[];
  /** Currently processed podcast */
  currentPodcast: any | null;
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
