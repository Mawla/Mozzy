"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { TextChunk } from "@/app/types/podcast/processing";
import { ProcessingLogger } from "@/app/core/processing/utils/logger";
import {
  refinedTranscriptSchema,
  contentAnalysisSchema,
  podcastEntitiesSchema,
} from "@/app/schemas/podcast";
import { podcastTimelineSchema } from "@/app/schemas/podcast/timeline";
import {
  refineTranscriptPrompt,
  analyzeContentPrompt,
  extractEntitiesPrompt,
  detectEventsPrompt,
} from "@/app/prompts/podcasts";

const model = openai("gpt-4");

export async function processTranscript(chunk: TextChunk) {
  try {
    const { object } = await generateObject({
      model,
      schema: refinedTranscriptSchema,
      schemaName: "RefinedTranscript",
      schemaDescription:
        "A refined version of the podcast transcript text with context",
      prompt: refineTranscriptPrompt(chunk.text),
      output: "object",
      temperature: 0,
    });

    // Return just the refined content, but keep context for future use if needed
    return object.refinedContent;
  } catch (error) {
    ProcessingLogger.log("error", "Failed to process transcript", {
      error,
      chunkId: chunk.id,
    });
    throw error;
  }
}

export async function analyzeContent(chunk: TextChunk) {
  try {
    const { object } = await generateObject({
      model,
      schema: contentAnalysisSchema,
      schemaName: "PodcastAnalysis",
      schemaDescription:
        "Analysis of the podcast content including key points and themes",
      prompt: analyzeContentPrompt(chunk.text),
      output: "object",
      temperature: 0.3,
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

export async function extractEntities(chunk: TextChunk) {
  try {
    const { object } = await generateObject({
      model,
      schema: podcastEntitiesSchema,
      schemaName: "PodcastEntities",
      schemaDescription:
        "Detailed entities extracted from the podcast transcript",
      prompt: extractEntitiesPrompt(chunk.text),
      output: "object",
      temperature: 0.2, // Slightly increased temperature for more varied entity detection
      maxTokens: 2048, // Increased token limit for detailed entity extraction
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

export async function detectEvents(chunk: TextChunk) {
  try {
    const { object } = await generateObject({
      model,
      schema: podcastTimelineSchema,
      schemaName: "PodcastTimeline",
      schemaDescription:
        "Timeline of events detected from the podcast transcript",
      prompt: detectEventsPrompt(chunk.text),
      output: "object",
      temperature: 0.2, // Balanced between consistency and creativity
      maxTokens: 3072, // Increased token limit for detailed timeline construction
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
