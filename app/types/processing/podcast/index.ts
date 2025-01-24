import type { ProcessingStatus } from "../base";
import type {
  ProcessingResult,
  ProcessingStep as BaseProcessingStep,
  ProcessingState as BaseProcessingState,
  ProcessingChunk as BaseProcessingChunk,
  NetworkLog,
  ChunkResult as ProcessingChunkResult,
  ProcessingOptions,
  ProcessingAnalysis,
  TimelineEvent,
  ProcessingMetadata,
  SentimentAnalysis,
  TopicAnalysis,
  TextChunk as BaseTextChunk,
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
  ProcessedPodcast,
} from "../../shared/podcast";

/** Base text chunk with podcast-specific fields */
export interface PodcastTextChunk extends BaseTextChunk {
  /** Unique identifier */
  id: string;
  /** Text content */
  text: string;
  /** Start time in seconds */
  start?: number;
  /** End time in seconds */
  end?: number;
  /** Start index in full text */
  startIndex?: number;
  /** End index in full text */
  endIndex?: number;
  /** Identified speaker for this chunk */
  speaker?: string;
}

/** Processing step with podcast-specific fields */
export interface PodcastProcessingStep extends BaseProcessingStep {
  /** Additional data for the step */
  data?: StepData;
  /** Processing chunks */
  chunks?: PodcastProcessingChunk[];
  /** Progress percentage (0-100) */
  progress: number;
}

/** Processing state with podcast-specific fields */
export interface PodcastProcessingState extends BaseProcessingState {
  /** Processing steps */
  steps: PodcastProcessingStep[];
  /** Processing chunks */
  chunks: PodcastProcessingChunk[];
  /** Progress percentage (0-100) */
  progress: number;
}

/** Processing chunk with podcast-specific fields */
export interface PodcastProcessingChunk extends PodcastTextChunk {
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

/** Processing result with podcast-specific fields */
export interface PodcastProcessingResult extends ProcessingResult {
  /** Content format identifier */
  format: "podcast";
  /** Processing metadata */
  metadata: ProcessingMetadata;
  /** Analysis results */
  analysis?: PodcastAnalysis;
  /** Processed transcript */
  transcript?: string;
  /** Processing chunks */
  chunks?: PodcastTextChunk[];
  /** Extracted entities */
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
    topics?: TopicEntity[];
    concepts?: ConceptEntity[];
  };
  /** Timeline events */
  timeline?: TimelineEvent[];
}

/** Processing options with podcast-specific fields */
export interface PodcastProcessingOptions extends ProcessingOptions {
  /** Target platform for processing */
  targetPlatform?: string;
  /** Whether to analyze sentiment */
  analyzeSentiment?: boolean;
  /** Whether to extract entities */
  extractEntities?: boolean;
  /** Whether to include timestamps */
  includeTimestamps?: boolean;
}

/** Analysis results with podcast-specific fields */
export interface PodcastAnalysis extends ProcessingAnalysis {
  /** Podcast title */
  title?: string;
  /** Summary of the podcast */
  summary?: string;
  /** Extracted entities */
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  /** Timeline events */
  timeline?: TimelineEvent[];
  /** Sentiment analysis */
  sentiment?: SentimentAnalysis;
  /** Topic analysis */
  topics?: TopicAnalysis[];
  /** Main themes */
  themes?: string[];
  /** Key points */
  keyPoints?: Array<{
    title: string;
    description: string;
    relevance: string;
  }>;
  /** Quick facts */
  quickFacts?: {
    duration: string;
    participants: string[];
    recordingDate?: string;
    mainTopic: string;
    expertise: string;
  };
}

/** Data for each processing step */
export interface StepData {
  /** Refined content after processing */
  refinedContent?: string;
  /** Processing metadata */
  metadata?: ProcessingMetadata;
  /** Analysis results */
  analysis?: PodcastAnalysis;
}
