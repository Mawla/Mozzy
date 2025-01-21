// Core Processing Types
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  EntityMention,
  EntityRelationship,
  TopicEntity,
  ConceptEntity,
} from "@/app/types/entities";

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
  refinedText: string;
  analysis?: ProcessingAnalysis;
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

export interface ProcessingState {
  status: ProcessingStatus;
  error?: Error;
  overallProgress: number;
  steps: ProcessingStep[];
  chunks: BaseTextChunk[];
  networkLogs: NetworkLog[];
  currentTranscript: string;
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: ProcessingStatus;
  progress?: number;
  error?: Error;
  description?: string;
  data?: any;
  chunks?: BaseTextChunk[];
  networkLogs?: NetworkLog[];
}

export interface NetworkLog {
  timestamp: string;
  type: "request" | "response" | "error";
  message: string;
  data?: any;
}

// Add ProcessingResult interface
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
