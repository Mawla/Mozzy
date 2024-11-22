"use server";

import { generateObject } from "ai";
// import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { TextChunk } from "@/app/types/podcast/processing";
import { ProcessingLogger } from "@/app/core/processing/utils/logger";
import {
  refinedTranscriptSchema,
  RefinedTranscript,
} from "@/app/schemas/podcast/transcript";
import {
  contentAnalysisSchema,
  PodcastAnalysis,
} from "@/app/schemas/podcast/analysis";
import { entitySchema, PodcastEntities } from "@/app/schemas/podcast/entities";
import {
  refineTranscriptPrompt,
  analyzeContentPrompt,
  extractEntitiesPrompt,
} from "@/app/prompts/podcasts";

// Initialize Anthropic client
// const model = anthropic("claude-3-sonnet");
// const model: openai('gpt-4o');
const model = openai("gpt-4o");
// Pure server actions - no dependencies on service
export async function processTranscript(chunk: TextChunk) {
  try {
    const { object } = await generateObject({
      model,
      schema: refinedTranscriptSchema,
      schemaName: "RefinedTranscript",
      schemaDescription: "A refined version of the podcast transcript text",
      prompt: refineTranscriptPrompt(chunk.text),
      output: "object",
      temperature: 0, // Lower temperature for more consistent output
    });

    return object.refinedContent || object.transcript || chunk.text;
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
      temperature: 0.3, // Slightly higher for analysis
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
      schema: entitySchema,
      schemaName: "PodcastEntities",
      schemaDescription: "Entities extracted from the podcast transcript",
      prompt: extractEntitiesPrompt(chunk.text),
      output: "object",
      temperature: 0, // Lower temperature for entity extraction
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
