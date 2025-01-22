import type { ProcessingStatus, NetworkLog } from "../base";
import type { PodcastTextChunk, PodcastAnalysis } from "./public";

/**
 * Internal state tracking for podcast processing operations.
 * Used to monitor progress and maintain processing context during
 * transcription, diarization, and analysis phases.
 */
export interface PodcastProcessingState {
  /** Current processing status */
  status: ProcessingStatus;
  /** Error information if processing failed */
  error?: Error;
  /** Overall progress percentage (0-100) */
  overallProgress: number;
  /** Current processing step identifier */
  currentStep: string;
  /** Processed text chunks */
  chunks: PodcastTextChunk[];
  /** Partial analysis results */
  analysis: Partial<PodcastAnalysis>;
  /** Network operation logs */
  networkLogs: NetworkLog[];
  /** Transcription step progress (0-100) */
  transcriptionProgress: number;
  /** Speaker diarization step progress (0-100) */
  diarizationProgress: number;
  /** Content analysis step progress (0-100) */
  analysisProgress: number;
}

/**
 * Represents a single step in the podcast processing pipeline.
 * Used to track progress and state of individual processing steps
 * like transcription, diarization, and analysis.
 */
export interface PodcastProcessingStep {
  /** Unique step identifier */
  id: string;
  /** Human-readable step name */
  name: string;
  /** Current step status */
  status: ProcessingStatus;
  /** Step completion percentage (0-100) */
  progress: number;
  /** Error information if step failed */
  error?: Error;
  /** Step description for UI display */
  description: string;
  /** Text chunks processed in this step */
  chunks?: PodcastTextChunk[];
  /** Network logs for this step */
  networkLogs?: NetworkLog[];
}

/**
 * Results from the transcription phase.
 * Contains detailed word-level transcription with timing
 * and confidence information.
 */
export interface PodcastTranscriptionResult {
  /** Complete transcribed text */
  text: string;
  /** Overall transcription confidence (0-1) */
  confidence: number;
  /** Individual word-level transcription details */
  words: Array<{
    /** Transcribed word */
    word: string;
    /** Start time in seconds */
    start: number;
    /** End time in seconds */
    end: number;
    /** Word-level confidence score (0-1) */
    confidence: number;
  }>;
  /** Speaker segments if diarization was enabled */
  speakers?: Array<{
    /** Unique speaker identifier */
    id: string;
    /** Speaking segments for this speaker */
    segments: Array<{
      /** Start time in seconds */
      start: number;
      /** End time in seconds */
      end: number;
    }>;
  }>;
}

/**
 * Results from the speaker diarization phase.
 * Maps speech segments to identified speakers with timing
 * and confidence information.
 */
export interface PodcastDiarizationResult {
  /** Identified speakers and their segments */
  speakers: Array<{
    /** Unique speaker identifier */
    id: string;
    /** Identified speaker name if available */
    name?: string;
    /** Speaking segments for this speaker */
    segments: Array<{
      /** Start time in seconds */
      start: number;
      /** End time in seconds */
      end: number;
      /** Transcribed text for this segment */
      text: string;
      /** Segment-level confidence score (0-1) */
      confidence: number;
    }>;
  }>;
}

/**
 * Extended metadata for podcast text chunks.
 * Used internally for content analysis and speaker tracking.
 */
export interface PodcastChunkMetadata {
  /** Identified speaker for the chunk */
  speaker?: string;
  /** Start time in seconds */
  start: number;
  /** End time in seconds */
  end: number;
  /** Transcription confidence score (0-1) */
  confidence: number;
  /** Topics discussed in the chunk */
  topics?: string[];
  /** Sentiment score for the chunk (-1 to 1) */
  sentiment?: number;
}
