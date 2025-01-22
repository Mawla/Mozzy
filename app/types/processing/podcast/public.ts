import type {
  BaseProcessingResult,
  ProcessingOptions,
  ProcessingAnalysis,
  TimelineEvent,
  BaseTextChunk,
  ProcessingStatus,
} from "../base";

import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
} from "@/app/types/entities/podcast";

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
