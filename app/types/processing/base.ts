// Core Processing Types
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  EntityMention,
  EntityRelationship,
} from "@/app/types/entities/base";

import { ContentMetadata } from "../contentMetadata";
import { BaseEntities } from "../shared/entities";

// Base Types
export type ProcessingFormat = "podcast" | "post";

export type ProcessingQuality = "draft" | "final";

export type ProcessingStatus =
  | "idle"
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "error";

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

export interface BaseProcessingResult {
  id: string;
  status: ProcessingStatus;
  success: boolean;
  output: string;
  error?: string;
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
}

export interface ProcessingAdapter {
  validate: (input: string) => Promise<boolean>;
  process: (
    input: string,
    options: ProcessingOptions
  ) => Promise<BaseProcessingResult>;
  getStatus: (id: string) => Promise<BaseProcessingResult>;
}

export interface ChunkResult {
  id: string;
  text: string;
  refinedText?: string;
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

export interface ProcessingResult extends BaseProcessingResult {
  format: ProcessingFormat;
  analysis: ProcessingAnalysis;
  entities: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
    topics?: TopicEntity[];
    concepts?: ConceptEntity[];
  };
  timeline: TimelineEvent[];
}

export interface ProcessingChunk extends BaseTextChunk {
  status: ProcessingStatus;
  progress: number;
  error?: Error;
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
