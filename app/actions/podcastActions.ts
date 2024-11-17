"use server";

import { AnthropicHelper } from "@/utils/AnthropicHelper";
import {
  refineTranscriptPrompt,
  analyzeContentPrompt,
  extractEntitiesPrompt,
  createTimelinePrompt,
} from "@/app/prompts/podcasts";
import {
  sanitizeJsonString,
  extractJsonFieldFromString,
  unescapeJsonString,
} from "@/utils/stringUtils";
import { podcastService } from "@/app/services/podcastService";
import { TextChunk } from "@/app/types/podcast/processing";

const anthropicHelper = AnthropicHelper.getInstance();
const MAX_OUTPUT_TOKENS = 8192;

export async function processTranscript(transcript: string) {
  return podcastService.processInChunks(
    transcript,
    async (chunk: TextChunk) => {
      const response = await anthropicHelper.getCompletion(
        refineTranscriptPrompt(chunk.text),
        MAX_OUTPUT_TOKENS
      );

      try {
        const sanitizedResponse = sanitizeJsonString(response);
        const parsedResponse = JSON.parse(sanitizedResponse);
        return (
          parsedResponse.refinedContent || parsedResponse.transcript || response
        );
      } catch (error) {
        console.error("Error processing chunk:", error);
        return chunk.text;
      }
    },
    (chunks) => chunks.join(" ")
  );
}

export async function analyzeContent(transcript: string) {
  return podcastService.processInChunks(
    transcript,
    async (chunk: TextChunk) => {
      const response = await anthropicHelper.getCompletion(
        analyzeContentPrompt(chunk.text),
        MAX_OUTPUT_TOKENS
      );
      const sanitizedResponse = sanitizeJsonString(response);
      return JSON.parse(sanitizedResponse);
    },
    (analyses) => podcastService.mergeAnalyses(analyses)
  );
}

export async function extractEntities(transcript: string) {
  return podcastService.processInChunks(
    transcript,
    async (chunk: TextChunk) => {
      const response = await anthropicHelper.getCompletion(
        extractEntitiesPrompt(chunk.text),
        MAX_OUTPUT_TOKENS
      );
      const sanitizedResponse = sanitizeJsonString(response);
      return JSON.parse(sanitizedResponse);
    },
    (entities) => podcastService.mergeEntities(entities)
  );
}

export async function createTimeline(transcript: string) {
  return podcastService.processInChunks(
    transcript,
    async (chunk: TextChunk) => {
      const response = await anthropicHelper.getCompletion(
        createTimelinePrompt(chunk.text),
        MAX_OUTPUT_TOKENS
      );
      const sanitizedResponse = sanitizeJsonString(response);
      return JSON.parse(sanitizedResponse);
    },
    (timelines) => podcastService.mergeTimelines(timelines)
  );
}
