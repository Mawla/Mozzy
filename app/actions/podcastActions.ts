"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { TextChunk } from "@/app/types/podcast/processing";
import { ProcessingLogger } from "@/app/core/processing/utils/logger";
import {
  refinedTranscriptSchema,
  contentAnalysisSchema,
  entitySchema,
} from "@/app/schemas/podcast";
import {
  refineTranscriptPrompt,
  analyzeContentPrompt,
  extractEntitiesPrompt,
} from "@/app/prompts/podcasts";

const model = openai("gpt-4o");

export async function processTranscript(chunk: TextChunk) {
  try {
    const { object } = await generateObject<RefinedTranscript>({
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
      schema: entitySchema,
      schemaName: "PodcastEntities",
      schemaDescription: "Entities extracted from the podcast transcript",
      prompt: extractEntitiesPrompt(chunk.text),
      output: "object",
      temperature: 0,
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
