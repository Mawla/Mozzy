import type { ProcessingStatus, NetworkLog } from "../base";
import type { PostTextChunk, PostAnalysis } from "./index";

/**
 * Internal state tracking for post processing operations.
 * Used to monitor progress and maintain processing context.
 */
export interface PostProcessingState {
  /** Current processing status */
  status: ProcessingStatus;
  /** Error information if processing failed */
  error?: Error;
  /** Overall progress percentage (0-100) */
  overallProgress: number;
  /** Current processing step identifier */
  currentStep: string;
  /** Processed text chunks */
  chunks: PostTextChunk[];
  /** Partial analysis results */
  analysis: Partial<PostAnalysis>;
  /** Network operation logs */
  networkLogs: NetworkLog[];
  /** Content analysis step progress (0-100) */
  contentAnalysisProgress: number;
  /** Platform adaptation step progress (0-100) */
  platformAdaptationProgress: number;
  /** Content optimization step progress (0-100) */
  optimizationProgress: number;
}

/**
 * Represents a single step in the post processing pipeline.
 * Used to track progress and state of individual processing steps.
 */
export interface PostProcessingStep {
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
  chunks?: PostTextChunk[];
  /** Network logs for this step */
  networkLogs?: NetworkLog[];
}

/**
 * Results from the content analysis phase.
 * Contains detailed analysis of content structure and readability.
 */
export interface PostContentAnalysisResult {
  /** Extracted key points with context */
  keyPoints: Array<{
    /** Key point text */
    text: string;
    /** Importance score (0-1) */
    importance: number;
    /** Surrounding context */
    context: string;
  }>;
  /** Overall readability score (0-100) */
  readabilityScore: number;
  /** Content improvement suggestions */
  suggestions: Array<{
    /** Type of improvement */
    type: "complexity" | "length" | "structure";
    /** Original text */
    text: string;
    /** Suggested improvement */
    suggestion: string;
    /** Expected impact score (0-1) */
    impact: number;
  }>;
}

/**
 * Results from the content optimization phase.
 * Contains platform-specific adaptations and SEO improvements.
 */
export interface PostOptimizationResult {
  /** Platform-specific content versions */
  platformVersions: {
    [key: string]: {
      /** Adapted content */
      content: string;
      /** Platform-specific hashtags */
      hashtags: string[];
      /** Platform-specific mentions */
      mentions: string[];
      /** Predicted engagement score (0-1) */
      estimatedEngagement: number;
    };
  };
  /** SEO improvement suggestions */
  seoSuggestions: Array<{
    /** Type of SEO improvement */
    type: "keyword" | "structure" | "metadata";
    /** Suggested improvement */
    suggestion: string;
    /** Priority level (0-1) */
    priority: number;
  }>;
}

/**
 * Extended metadata for post text chunks.
 * Used internally for content analysis and optimization.
 */
export interface PostChunkMetadata {
  /** Chunk importance score (0-1) */
  importance: number;
  /** Whether chunk contains key information */
  isKeyPoint: boolean;
  /** Readability score (0-100) */
  readabilityScore: number;
  /** Identified topics */
  topics?: string[];
  /** Sentiment score (-1 to 1) */
  sentiment?: number;
  /** Suggested improvements */
  suggestedEdits?: Array<{
    /** Original text */
    original: string;
    /** Suggested change */
    suggestion: string;
    /** Reason for suggestion */
    reason: string;
    /** Confidence in suggestion (0-1) */
    confidence: number;
  }>;
}
