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
  PostPersonEntity,
  PostOrganizationEntity,
  PostLocationEntity,
  PostEventEntity,
} from "@/app/types/entities/post";

import { BaseEntities } from "@/app/types/shared/entities";

// Export public types
export * from "./public";

// Export internal types
export * from "./internal";

// Public Types
/**
 * Configuration options for post processing operations.
 * Extends base processing options with post-specific settings.
 */
export interface PostProcessingOptions extends ProcessingOptions {
  /** Whether to extract key points from the content */
  extractKeyPoints: boolean;
  /** Whether to generate a summary of the content */
  generateSummary: boolean;
  /** Target social media platform for content adaptation */
  targetPlatform: "twitter" | "linkedin" | "facebook" | "medium";
  /** Writing style for content adaptation */
  contentStyle?: "professional" | "casual" | "academic";
  /** Maximum length of the processed content */
  maxLength?: number;
}

/**
 * Represents a chunk of processed post text with metadata.
 * Extends base text chunk with post-specific attributes.
 */
export interface PostTextChunk extends BaseTextChunk {
  /** Relative importance score of the chunk (0-1) */
  importance: number;
  /** Whether this chunk contains a key point */
  isKeyPoint: boolean;
  /** Sentiment score of the chunk (-1 to 1) */
  sentiment?: number;
  /** Topics identified in the chunk */
  topics?: string[];
  /** Suggested improvements for the chunk */
  suggestedEdits?: Array<{
    /** Original text segment */
    original: string;
    /** Suggested replacement text */
    suggestion: string;
    /** Explanation for the suggestion */
    reason: string;
  }>;
}

/**
 * Analysis results for post processing.
 * Extends base analysis with post-specific insights.
 */
export interface PostAnalysis extends Omit<ProcessingAnalysis, "keyPoints"> {
  /** Key points extracted from the content */
  keyPoints: Array<{
    /** Title of the key point */
    title: string;
    /** Detailed description of the key point */
    description: string;
    /** Relevance score or category */
    relevance: string;
    /** Importance score (0-1) */
    importance: number;
    /** Related topics */
    topics?: string[];
  }>;
  /** Content readability analysis */
  readability: {
    /** Overall readability score (0-100) */
    score: number;
    /** Improvement suggestions */
    suggestions: Array<{
      /** Type of readability issue */
      type: "complexity" | "length" | "structure";
      /** Problematic text */
      text: string;
      /** Suggested improvement */
      suggestion: string;
    }>;
  };
  /** Analysis of content structure */
  contentStructure: Array<{
    /** Section type */
    type: "introduction" | "mainPoint" | "supporting" | "conclusion";
    /** Section content */
    text: string;
    /** Section effectiveness score (0-1) */
    strength: number;
  }>;
}

/**
 * Complete result of post processing operation.
 * Extends base processing result with post-specific outputs.
 */
export interface PostProcessingResult extends BaseProcessingResult {
  /** Content format identifier */
  format: "post";
  /** Detailed content analysis */
  analysis: PostAnalysis;
  /** Processed text chunks */
  chunks: PostTextChunk[];
  /** Generated content summary */
  summary: string;
  /** Generated title suggestions */
  suggestedTitles: string[];
  /** Extracted entities from content */
  entities: {
    /** People mentioned in the content */
    people: PostPersonEntity[];
    /** Organizations mentioned in the content */
    organizations: PostOrganizationEntity[];
    /** Locations mentioned in the content */
    locations: PostLocationEntity[];
    /** Events mentioned in the content */
    events: PostEventEntity[];
  };
  /** Platform-specific content versions */
  platformSpecificVersions?: {
    [key: string]: {
      /** Adapted content for platform */
      content: string;
      /** Relevant hashtags for the platform */
      hashtags?: string[];
      /** User mentions for the platform */
      mentions?: string[];
    };
  };
  /** Current processing status */
  status: ProcessingStatus;
}

// Internal Types
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

/**
 * Post-specific entities structure
 * Extends base entities with post-specific fields
 */
export interface PostEntities extends BaseEntities {
  /** Paragraph references for entity mentions */
  paragraphRefs?: Record<string, number[]>;
  /** Entity importance scores */
  importanceScores?: Record<string, number>;
}
