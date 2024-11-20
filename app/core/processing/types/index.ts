import type { TimelineEvent } from "@/app/types/podcast/processing";

export type {
  ProcessingResult,
  TextChunk,
  ChunkResult,
  PodcastAnalysis,
  ContentMetadata,
  MetadataResponse,
  PodcastEntities,
} from "@/app/types/podcast/processing";

export interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  error?: Error;
  dependencies?: string[];
}

export interface ProcessingState {
  id: string;
  steps: ProcessingStep[];
  currentStep: number;
  overallProgress: number;
  status: "idle" | "processing" | "completed" | "failed";
  error?: Error;
}

export interface PodcastProcessingResult {
  metadata: {
    title: string;
    duration: string;
    speakers: string[];
    topics: string[];
  };
  content: {
    transcript: string;
    refinedTranscript: string;
    summary: string;
  };
  analysis: {
    entities: {
      people: string[];
      organizations: string[];
      locations: string[];
      concepts: string[];
    };
    timeline: TimelineEvent[];
    topics: TopicAnalysis[];
    sentiment: SentimentAnalysis;
  };
}

export interface TopicAnalysis {
  name: string;
  relevance: number;
  mentions: number;
  relatedEntities: string[];
}

export interface SentimentAnalysis {
  overall: number;
  segments: {
    text: string;
    sentiment: number;
    confidence: number;
  }[];
}

export interface ProcessingOptions {
  chunkSize?: number;
  overlap?: number;
  maxParallelProcessing?: number;
  includeTimestamps?: boolean;
  extractEntities?: boolean;
  analyzeSentiment?: boolean;
}
