import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
} from "@/app/types/entities/base";

import { ContentMetadata } from "../contentMetadata";
import { BaseEntities } from "../shared/entities";
import { ProcessingFormat, ProcessingQuality, ProcessingStatus } from "./base";

export interface TimelineEvent {
  timestamp: string;
  event: string;
  speakers?: string[];
  topics?: string[];
  time?: string;
}

export interface SentimentAnalysis {
  overall: number;
  segments: Array<{
    text: string;
    score: number;
  }>;
}

export interface TopicAnalysis {
  name: string;
  confidence: number;
  keywords: string[];
}

export interface ProcessingOptions {
  format: ProcessingFormat;
  quality: ProcessingQuality;
  targetPlatform?: string;
  analyzeSentiment?: boolean;
  extractEntities?: boolean;
  includeTimestamps?: boolean;
}

export interface ProcessingMetadata {
  format: ProcessingFormat;
  platform: string;
  processedAt: string;
  title?: string;
  duration?: string;
  speakers?: string[];
  topics?: string[];
}

export interface BaseTextChunk {
  id: string;
  text: string;
  start?: number;
  end?: number;
  startIndex?: number;
  endIndex?: number;
}

export interface ProcessingAnalysis {
  id?: string;
  title?: string;
  summary?: string;
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
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

export interface ProcessingResult {
  id: string;
  status: ProcessingStatus;
  success: boolean;
  output: string;
  error?: string;
  format: ProcessingFormat;
  metadata: ProcessingMetadata;
  analysis?: ProcessingAnalysis;
  transcript?: string;
  chunks?: BaseTextChunk[];
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
    topics?: TopicEntity[];
    concepts?: ConceptEntity[];
  };
  timeline?: TimelineEvent[];
  title?: string;
  summary?: string;
  quickFacts?: {
    duration: string;
    participants: string[];
    recordingDate?: string;
    mainTopic: string;
    expertise: string;
  };
}

export interface ProcessingAdapter {
  validate: (input: string) => Promise<boolean>;
  process: (
    input: string,
    options: ProcessingOptions
  ) => Promise<ProcessingResult>;
  getStatus: (id: string) => Promise<ProcessingResult>;
}

export interface ChunkResult {
  id: string;
  text: string;
  refinedText?: string;
  status: ProcessingStatus;
  progress: number;
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
    topics?: TopicEntity[];
    concepts?: ConceptEntity[];
  };
  analysis?: ProcessingAnalysis;
}

export interface NetworkLogData {
  request?: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
  };
  response?: {
    status?: number;
    headers?: Record<string, string>;
    body?: unknown;
  };
  error?: {
    code?: string;
    details?: unknown;
  };
  metadata?: Record<string, unknown>;
}

export interface NetworkLog {
  timestamp: string;
  type: "request" | "response" | "error";
  message: string;
  data?: NetworkLogData;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: ProcessingStatus;
  progress: number;
  error?: Error | string;
  dependencies?: string[];
  result?: unknown;
  description?: string;
  networkLogs?: NetworkLog[];
  chunks?: ProcessingChunk[];
}

export interface ProcessingState {
  status: ProcessingStatus;
  error?: string;
  overallProgress: number;
  steps: ProcessingStep[];
  chunks: BaseTextChunk[];
  networkLogs: NetworkLog[];
  currentTranscript: string;
}

export interface ProcessingChunk {
  /** Unique chunk ID */
  id: string;

  /** The text content of this chunk */
  text: string;

  /** A number from 0 to 100 representing how "complete" the chunk is */
  progress: number;

  /** Processing status */
  status: ProcessingStatus;

  /** Error if any occurred */
  error?: Error;

  /** Processing result */
  result?: ChunkResult;
}

export type TextChunk = BaseTextChunk;

/**
 * Response containing metadata and analysis results
 */
export interface MetadataResponse {
  /** Content metadata */
  metadata: ContentMetadata;
  /** Analysis results */
  analysis?: ProcessingAnalysis;
  /** Extracted entities */
  entities?: BaseEntities;
}
