import type { ProcessingStatus, NetworkLog } from "../base";
import type { PodcastTextChunk, PodcastAnalysis } from "./index";

export interface PodcastProcessingState {
  status: ProcessingStatus;
  error?: Error;
  overallProgress: number;
  currentStep: string;
  chunks: PodcastTextChunk[];
  analysis: Partial<PodcastAnalysis>;
  networkLogs: NetworkLog[];
  transcriptionProgress: number;
  diarizationProgress: number;
  analysisProgress: number;
}

export interface PodcastProcessingStep {
  id: string;
  name: string;
  status: ProcessingStatus;
  progress: number;
  error?: Error;
  description: string;
  chunks?: PodcastTextChunk[];
  networkLogs?: NetworkLog[];
}

export interface PodcastTranscriptionResult {
  text: string;
  confidence: number;
  words: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
  speakers?: Array<{
    id: string;
    segments: Array<{
      start: number;
      end: number;
    }>;
  }>;
}

export interface PodcastDiarizationResult {
  speakers: Array<{
    id: string;
    name?: string;
    segments: Array<{
      start: number;
      end: number;
      text: string;
      confidence: number;
    }>;
  }>;
}

export interface PodcastChunkMetadata {
  speaker?: string;
  start: number;
  end: number;
  confidence: number;
  topics?: string[];
  sentiment?: number;
}
