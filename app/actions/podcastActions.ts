"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { TextChunk } from "@/app/types/podcast/processing";
import { ProcessingLogger } from "@/app/core/processing/utils/logger";
import {
  refinedTranscriptSchema,
  contentAnalysisSchema,
  podcastEntitiesSchema,
  type RefinedTranscript,
  type ContentAnalysis,
  type PodcastEntities,
} from "@/app/schemas/podcast";
import {
  podcastTimelineSchema,
  type PodcastTimeline,
} from "@/app/schemas/podcast/timeline";
import {
  refineTranscriptPrompt,
  analyzeContentPrompt,
  extractEntitiesPrompt,
  detectEventsPrompt,
} from "@/app/prompts/podcasts";

// GPT-4 has a context window of ~8k tokens (~32k characters)
// Our chunk size is 4k characters (~1k tokens)
// This leaves ~7k tokens for completion in a single API call
const model = openai("gpt-4");

/**
 * Process and refine a transcript chunk.
 *
 * Token allocation:
 * - Input: ~1k tokens (4k characters from chunk)
 * - System prompt + schema: ~200 tokens
 * - Available for completion: ~2k tokens
 *
 * Parameters optimized for accurate transcription:
 * - temperature: 0 for deterministic output
 * - no penalties to maintain original meaning
 */
export async function processTranscript(chunk: TextChunk) {
  try {
    const { object } = await generateObject<RefinedTranscript>({
      model,
      schema: refinedTranscriptSchema,
      schemaName: "RefinedTranscript",
      schemaDescription:
        "A refined version of the podcast transcript text with context",
      prompt: refineTranscriptPrompt(chunk.text),
      temperature: 0,
      maxTokens: 2048,
      presencePenalty: 0,
      frequencyPenalty: 0,
    });

    return object.refinedContent;
  } catch (error) {
    ProcessingLogger.log("error", "Failed to process transcript", {
      error,
      chunkId: chunk.id,
    });
    throw error;
  }
}

/**
 * Analyze content for key points, themes, and structure.
 *
 * Token allocation:
 * - Input: ~1k tokens (4k characters from chunk)
 * - System prompt + schema: ~500 tokens
 * - Available for completion: ~3k tokens
 *
 * Parameters optimized for insightful analysis:
 * - Moderate temperature for balanced creativity
 * - Higher penalties to encourage diverse analysis
 */
export async function analyzeContent(chunk: TextChunk) {
  try {
    const { object } = await generateObject<ContentAnalysis>({
      model,
      schema: contentAnalysisSchema,
      schemaName: "PodcastAnalysis",
      schemaDescription:
        "Comprehensive analysis of podcast content including key points, themes, and narrative structure",
      prompt: analyzeContentPrompt(chunk.text),
      temperature: 0.3,
      maxTokens: 3072,
      presencePenalty: 0.2,
      frequencyPenalty: 0.3,
    });

    return object;
  } catch (error) {
    ProcessingLogger.log("error", "Failed to analyze content", {
      error,
      chunkId: chunk.id,
    });
    throw error;
  }
}

/**
 * Extract and categorize entities with rich context.
 *
 * Token allocation:
 * - Input: ~1k tokens (4k characters from chunk)
 * - System prompt + schema: ~800 tokens
 * - Available for completion: ~4k tokens
 *
 * Parameters optimized for comprehensive entity extraction:
 * - Low temperature for consistent entity detection
 * - Light penalties to maintain natural relationships
 */
export async function extractEntities(chunk: TextChunk) {
  try {
    const { object } = await generateObject<PodcastEntities>({
      model,
      schema: podcastEntitiesSchema,
      schemaName: "PodcastEntities",
      schemaDescription: `
        Extract and categorize entities from podcast content with rich context and relationships.
        Includes people (speakers, mentioned individuals), organizations, locations, events,
        topics, and concepts. Each entity includes detailed context, relationships, and relevant quotes.
      `,
      prompt: extractEntitiesPrompt(chunk.text),
      temperature: 0.1,
      maxTokens: 4096,
      presencePenalty: 0.1,
      frequencyPenalty: 0.1,
    });

    return object;
  } catch (error) {
    ProcessingLogger.log("error", "Failed to extract entities", {
      error,
      chunkId: chunk.id,
    });
    throw error;
  }
}

/**
 * Detect and construct timeline of events.
 *
 * Token allocation:
 * - Input: ~1k tokens (4k characters from chunk)
 * - System prompt + schema: ~1k tokens
 * - Available for completion: ~4k tokens
 *
 * Parameters optimized for temporal analysis:
 * - Moderate temperature for event interpretation
 * - Balanced penalties for natural event flow
 */
export async function detectEvents(chunk: TextChunk) {
  try {
    const { object } = await generateObject<PodcastTimeline>({
      model,
      schema: podcastTimelineSchema,
      schemaName: "PodcastTimeline",
      schemaDescription: `
        Construct a detailed timeline of events from podcast content.
        Includes event detection, temporal relationships, causality chains,
        and narrative segments. Each event includes context, participants,
        and relationships to other events.
      `,
      prompt: detectEventsPrompt(chunk.text),
      temperature: 0.2,
      maxTokens: 4096,
      presencePenalty: 0.2,
      frequencyPenalty: 0.2,
    });

    return object;
  } catch (error) {
    ProcessingLogger.log("error", "Failed to detect events", {
      error,
      chunkId: chunk.id,
    });
    throw error;
  }
}
