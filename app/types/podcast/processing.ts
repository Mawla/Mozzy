import {
  PodcastAnalysis as BasePodcastAnalysis,
  PodcastEntities as BasePodcastEntities,
  Section,
} from "./models";

// Re-export the base types with sections
export interface PodcastAnalysis extends Omit<BasePodcastAnalysis, "sections"> {
  sections?: Section[];
}

// Re-export PodcastEntities type
export type PodcastEntities = BasePodcastEntities;
export type { Section };

// Processing State Types
export interface ProcessingState {
  chunks: ProcessingChunk[];
  networkLogs: NetworkLog[];
  currentTranscript: string;
}

export interface ProcessingChunk {
  id: number;
  text: string;
  status: "pending" | "processing" | "completed" | "error";
  response?: string;
  error?: string;
}

export interface NetworkLog {
  timestamp: string;
  type: "request" | "response" | "error";
  message: string;
}

// Analysis Types
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

export interface Theme {
  name: string;
  description: string;
  relatedConcepts: string[];
}

export interface TimelineEvent {
  time: string;
  event: string;
  importance: "high" | "medium" | "low";
}

// Processing Step Types
export interface TextChunk {
  text: string;
  startIndex: number;
  endIndex: number;
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
  quickFacts?: QuickFact;
  keyPoints?: KeyPoint[];
  themes?: Theme[];
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
  quickFacts?: QuickFact;
  keyPoints?: KeyPoint[];
  themes?: Theme[];
  people?: string[];
  organizations?: string[];
  locations?: string[];
  events?: string[];
  timeline?: TimelineEvent[];
};

export type ProcessingStatus = "idle" | "processing" | "completed" | "error";

export interface ProcessingStep {
  name: string;
  status: ProcessingStatus;
  data: StepData | null;
  error?: Error;
}

export interface ProcessingResult {
  transcript: string;
  analysis: PodcastAnalysis;
  entities: PodcastEntities;
  timeline: TimelineEvent[];
}

// Component Props Types
export interface ChunkVisualizerProps {
  chunks: ProcessingChunk[];
}

export interface NetworkLoggerProps {
  logs: NetworkLog[];
  className?: string;
}

export interface ProcessingPipelineProps {
  steps: ProcessingStep[];
  onRetryStep: (stepName: string) => void;
  isProcessing: boolean;
}

export type ProcessingTab = "progress" | "chunks" | "result" | "logs";
