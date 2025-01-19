// Core Processing Types
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
} from "@/app/schemas/podcast/entities";

// Base Types
export type ProcessingFormat = "podcast" | "post";

export type ProcessingQuality = "draft" | "final";

export type ProcessingStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface TimelineEvent {
  timestamp: string;
  event: string;
  speakers?: string[];
  topics?: string[];
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
  id: number;
  text: string;
  start?: number;
  end?: number;
  startIndex?: number;
  endIndex?: number;
}

export interface ProcessingAnalysis {
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
}

export interface BaseProcessingResult {
  id: string;
  status: ProcessingStatus;
  output: string;
  error?: string;
  metadata: ProcessingMetadata;
  analysis?: ProcessingAnalysis;
  transcript?: string;
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
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

// Re-export entity types for convenience
export type { PersonEntity, OrganizationEntity, LocationEntity, EventEntity };
