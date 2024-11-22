"use server";

import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { podcastService } from "@/app/services/podcastService";
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

const model = anthropic("claude-3-sonnet-20241022");

export async function processTranscript(transcript: string) {
  return podcastService.processInChunks<string>(
    transcript,
    async (chunk: TextChunk) => {
      const { object } = await generateObject<RefinedTranscript>({
        model,
        schema: refinedTranscriptSchema,
        prompt: refineTranscriptPrompt(chunk.text),
        output: "object",
      });
      return object.refinedContent || object.transcript || chunk.text;
    },
    (chunks: string[]) => chunks.join(" ")
  );
}

export async function analyzeContent(transcript: string) {
  return podcastService.processInChunks<PodcastAnalysis>(
    transcript,
    async (chunk: TextChunk) => {
      const { object } = await generateObject<PodcastAnalysis>({
        model,
        schema: contentAnalysisSchema,
        prompt: analyzeContentPrompt(chunk.text),
        output: "object",
      });
      return object;
    },
    (results: PodcastAnalysis[]) => podcastService.mergeAnalyses(results)
  );
}

export async function extractEntities(transcript: string) {
  return podcastService.processInChunks<PodcastEntities>(
    transcript,
    async (chunk: TextChunk) => {
      const { object } = await generateObject<PodcastEntities>({
        model,
        schema: entitySchema,
        prompt: extractEntitiesPrompt(chunk.text),
        output: "object",
      });
      return object;
    },
    podcastService.mergeEntities
  );
}
