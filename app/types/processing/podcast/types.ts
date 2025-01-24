import type {
  ProcessingStatus,
  ProcessingAnalysis,
  BaseProcessingResult,
  BaseTextChunk,
  TimelineEvent,
  ProcessingMetadata,
  ProcessingState as BaseProcessingState,
  ProcessingStep as BaseProcessingStep,
  NetworkLog,
  ChunkResult,
  ProcessingOptions,
} from "../base";

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

import type { ProcessingChunk as BaseChunk } from "@/app/types/processing/base";
import type { PodcastProcessingChunk } from "./types";

// Processing State Types
export interface ProcessingStep extends BaseProcessingStep {
  id: string;
  name: string;
  status: ProcessingStatus;
  progress: number;
  error?: Error;
  description?: string;
  data?: any;
  chunks?: ProcessingChunk[];
  networkLogs?: NetworkLog[];
}

export interface ProcessingState extends BaseProcessingState {
  steps: ProcessingStep[];
  chunks: ProcessingChunk[];
}

export interface TextChunk extends BaseTextChunk {
  // Add any podcast-specific fields here
}

export interface ProcessingChunk extends TextChunk {
  status: ProcessingStatus;
  response?: string;
  error?: Error;
  result?: ProcessingChunkResult;
  analysis?: PodcastAnalysis;
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  timeline?: TimelineEvent[];
}

export interface ProcessingChunkResult extends Omit<ChunkResult, "timeline"> {
  id: string;
  text: string;
  refinedText: string;
  analysis?: ProcessingAnalysis;
  entities: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
    topics: TopicEntity[];
    concepts: ConceptEntity[];
  };
  timeline?: TimelineEvent[];
  status: ProcessingStatus;
  progress: number;
  error?: Error;
}

export interface ProcessingResult extends BaseProcessingResult {
  refinedTranscript: string;
  analysis: PodcastAnalysis;
  entities: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  timeline: TimelineEvent[];
}

// Podcast-specific analysis type
export interface PodcastAnalysis
  extends Omit<ProcessingAnalysis, "sections" | "themes"> {
  sections: Section[];
  themes: string[];
}

export interface QuickFact {
  duration: string;
  participants: string[];
  recordingDate?: string;
  mainTopic: string;
  expertise: string;
}

export interface KeyPoint {
  title: string;
  description: string;
  relevance: string;
}

export interface ChunkOptions {
  maxChunkSize?: number;
  overlap?: number;
  separator?: string;
}

export interface TranscriptStepData {
  refinedContent: string;
  chunks?: ProcessingChunk[];
  networkLogs?: NetworkLog[];
}

export interface AnalysisStepData {
  title?: string;
  summary?: string;
  quickFacts?: ProcessingAnalysis["quickFacts"];
  keyPoints?: ProcessingAnalysis["keyPoints"];
  themes?: string[];
}

export interface EntityStepData {
  people?: string[];
  organizations?: string[];
  locations?: string[];
  events?: string[];
}

export type StepData = {
  refinedContent?: string;
  chunks?: ProcessingChunk[];
  networkLogs?: NetworkLog[];
  title?: string;
  summary?: string;
  quickFacts?: ProcessingAnalysis["quickFacts"];
  keyPoints?: ProcessingAnalysis["keyPoints"];
  themes?: string[];
  people?: string[];
  organizations?: string[];
  locations?: string[];
  events?: string[];
  timeline?: TimelineEvent[];
};

export interface PodcastProcessingStep extends BaseProcessingStep {
  chunks?: PodcastProcessingChunk[];
  // Additional fields unique to the podcast step
  // e.g.:
  // transcriptId?: string;
}

export interface PodcastProcessingChunk extends ProcessingChunk {
  speaker?: string;
  progress?: number;
}
