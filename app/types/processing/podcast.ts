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
