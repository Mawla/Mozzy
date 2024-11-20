"use server";

import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { podcastService } from "@/app/services/podcastService";
import { TextChunk } from "@/app/utils/textChunking";
import {
  PodcastAnalysis,
  PodcastEntities,
} from "@/app/types/podcast/processing";
import { refinedTranscriptSchema } from "@/app/schemas/podcast/transcript";
import { contentAnalysisSchema } from "@/app/schemas/podcast/analysis";
import { entitySchema } from "@/app/schemas/podcast/entities";
import {
  refineTranscriptPrompt,
  analyzeContentPrompt,
  extractEntitiesPrompt,
} from "@/app/prompts/podcasts";

// Define the model once with the latest version
const model = anthropic("claude-3-sonnet-20241022");

export async function processTranscript(transcript: string) {
  return podcastService.processInChunks(
    transcript,
    async (chunk: TextChunk) => {
      const { object } = await generateObject({
        model,
        schema: refinedTranscriptSchema,
        prompt: refineTranscriptPrompt(chunk.text),
      });

      return object.refinedContent || object.transcript || chunk.text;
    },
    (chunks) => chunks.join(" ")
  );
}

export async function analyzeContent(transcript: string) {
  return podcastService.processInChunks(
    transcript,
    async (chunk: TextChunk) => {
      const { object } = await generateObject({
        model,
        schema: contentAnalysisSchema,
        prompt: analyzeContentPrompt(chunk.text),
      });

      return object as PodcastAnalysis;
    },
    (analyses) => podcastService.mergeAnalyses(analyses)
  );
}

export async function extractEntities(transcript: string) {
  return podcastService.processInChunks(
    transcript,
    async (chunk: TextChunk) => {
      const { object } = await generateObject({
        model,
        schema: entitySchema,
        prompt: extractEntitiesPrompt(chunk.text),
      });

      return object as PodcastEntities;
    },
    (entities) => podcastService.mergeEntities(entities)
  );
}

// Timeline functionality temporarily disabled
// export async function createTimeline(transcript: string) { ... }
