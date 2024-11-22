"use server";

import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { podcastService } from "@/app/services/podcastService";
import { TextChunk } from "@/app/utils/textChunking";
import {
  PodcastAnalysis,
  PodcastEntities,
} from "@/app/types/podcast/processing";
import { ProcessingLogger } from "@/app/core/processing/utils/logger";
import {
  refineTranscriptPrompt,
  analyzeContentPrompt,
  extractEntitiesPrompt,
} from "@/app/prompts/podcasts";
import { refinedTranscriptSchema } from "@/app/schemas/podcast/transcript";
import { contentAnalysisSchema } from "@/app/schemas/podcast/analysis";
import { entitySchema } from "@/app/schemas/podcast/entities";

// Initialize Anthropic client
const model = anthropic("claude-3-sonnet-20241022");

export async function processTranscript(transcript: string) {
  try {
    ProcessingLogger.log("debug", "Processing transcript", {
      length: transcript.length,
      preview: transcript.slice(0, 100),
    });

    return podcastService.processInChunks(
      transcript,
      async (chunk: TextChunk) => {
        const { object } = await generateObject({
          model,
          schema: refinedTranscriptSchema,
          prompt: refineTranscriptPrompt(chunk.text),
          output: "object",
        });

        return object.refinedContent || object.transcript || chunk.text;
      },
      (chunks) => chunks.join(" ")
    );
  } catch (error) {
    ProcessingLogger.log("error", "Failed to process transcript", { error });
    throw error;
  }
}

export async function analyzeContent(transcript: string) {
  try {
    return podcastService.processInChunks(
      transcript,
      async (chunk: TextChunk) => {
        const { object } = await generateObject({
          model,
          schema: contentAnalysisSchema,
          prompt: analyzeContentPrompt(chunk.text),
          output: "object",
        });

        return object as PodcastAnalysis;
      },
      (analyses) => podcastService.mergeAnalyses(analyses)
    );
  } catch (error) {
    ProcessingLogger.log("error", "Failed to analyze content", { error });
    throw error;
  }
}

export async function extractEntities(transcript: string) {
  try {
    return podcastService.processInChunks(
      transcript,
      async (chunk: TextChunk) => {
        const { object } = await generateObject({
          model,
          schema: entitySchema,
          prompt: extractEntitiesPrompt(chunk.text),
          output: "object",
        });

        return object as PodcastEntities;
      },
      (entities) => podcastService.mergeEntities(entities)
    );
  } catch (error) {
    ProcessingLogger.log("error", "Failed to extract entities", { error });
    throw error;
  }
}
