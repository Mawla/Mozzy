import type {
  BaseProcessingResult,
  ProcessingOptions,
  ProcessingAnalysis,
  TimelineEvent,
  BaseTextChunk,
  ProcessingStatus,
  NetworkLog,
} from "../base";

import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
} from "@/app/types/entities/podcast";

import { BaseEntities } from "@/app/types/shared/entities";

// Public Types
/**
 * Configuration options for podcast processing operations.
 * Extends base processing options with podcast-specific settings for
 * transcription, speaker detection, and timeline generation.
 */
export interface PodcastProcessingOptions extends ProcessingOptions {
  /** Whether to identify and extract distinct speakers */
  extractSpeakers: boolean;
  /** Whether to generate a timestamped event timeline */
  generateTimeline: boolean;
  /** Whether to perform speaker diarization (who spoke when) */
  speakerDiarization: boolean;
  /** Quality level for transcription processing */
  transcriptionQuality: "standard" | "premium";
}

/**
 * Represents a chunk of processed podcast audio transcription.
 * Extends base text chunk with speaker and confidence information.
 */
export interface PodcastTextChunk extends BaseTextChunk {
  /** Identified speaker for this chunk */
  speaker?: string;
  /** Transcription confidence score (0-1) */
  confidence?: number;
  /** Sentiment score for the chunk (-1 to 1) */
  sentiment?: number;
  /** Topics discussed in this chunk */
  topics?: string[];
}

/**
 * Analysis results for podcast processing.
 * Extends base analysis with podcast-specific insights including
 * speaker analysis and episode highlights.
 */
export interface PodcastAnalysis extends ProcessingAnalysis {
  /** Detailed speaker analysis */
  speakers: Array<{
    /** Speaker's identified name */
    name: string;
    /** Total speaking time in seconds */
    speakingTime: number;
    /** Individual speaking segments */
    segments: Array<{
      /** Start time in seconds */
      start: number;
      /** End time in seconds */
      end: number;
      /** Transcribed text for the segment */
      text: string;
    }>;
  }>;
  /** Key moments and highlights from the episode */
  episodeHighlights: Array<{
    /** Timestamp in HH:MM:SS format */
    timestamp: string;
    /** Highlight content */
    text: string;
    /** Speaker who made the highlight */
    speaker?: string;
    /** Topics discussed in the highlight */
    topics?: string[];
  }>;
}

/**
 * Complete result of podcast processing operation.
 * Extends base processing result with podcast-specific outputs
 * including transcription, speaker analysis, and entity extraction.
 */
export interface PodcastProcessingResult extends BaseProcessingResult {
  /** Content format identifier */
  format: "podcast";
  /** Detailed podcast analysis results */
  analysis: PodcastAnalysis;
  /** Processed transcription chunks */
  chunks: PodcastTextChunk[];
  /** List of identified speakers */
  speakers: string[];
  /** Chronological event timeline */
  timeline: TimelineEvent[];
  /** Extracted entities from transcription */
  entities: {
    /** People mentioned in the podcast */
    people: PersonEntity[];
    /** Organizations discussed */
    organizations: OrganizationEntity[];
    /** Locations referenced */
    locations: LocationEntity[];
    /** Events mentioned */
    events: EventEntity[];
  };
  /** Current processing status */
  status: ProcessingStatus;
}

// Internal Types
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

/**
 * Podcast-specific entities structure
 * Extends base entities with podcast-specific fields
 */
export interface PodcastEntities extends BaseEntities {
  /** Timestamps for entity mentions */
  timestamps?: Record<string, string[]>;
  /** Speaker associations */
  speakerAssociations?: Record<string, string[]>;
}

export * from "./types";
