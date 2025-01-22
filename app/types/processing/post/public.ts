import type {
  BaseProcessingResult,
  ProcessingOptions,
  ProcessingAnalysis,
  BaseTextChunk,
  ProcessingStatus,
} from "../base";

import type {
  PostPersonEntity,
  PostOrganizationEntity,
  PostLocationEntity,
  PostEventEntity,
} from "@/app/types/entities/post";

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
export interface PostProcessingResult
  extends Omit<BaseProcessingResult, "analysis"> {
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
