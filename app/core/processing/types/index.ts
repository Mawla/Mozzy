import { ProcessingResult as PodcastProcessingResult } from "@/app/types/podcast/processing";

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

export interface ProcessingOptions {
  format: ProcessingFormat;
  quality: ProcessingQuality;
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

export interface ProcessingAnalysis {
  entities?: {
    people: string[];
    organizations: string[];
    locations: string[];
    concepts: string[];
  };
  timeline?: TimelineEvent[];
  sentiment?: {
    overall: number;
    segments: Array<{
      text: string;
      score: number;
    }>;
  };
}

export interface ProcessingResult {
  id: string;
  status: ProcessingStatus;
  output: string;
  error?: string;
  metadata: ProcessingMetadata;
  analysis?: ProcessingAnalysis;
}

export interface ProcessingAdapter {
  validate: (input: string) => Promise<boolean>;
  process: (
    input: string,
    options: ProcessingOptions
  ) => Promise<ProcessingResult>;
  getStatus: (id: string) => Promise<ProcessingResult>;
}
