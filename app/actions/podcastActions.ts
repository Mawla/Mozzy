"use server";

import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
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

// Pure server actions - no dependencies on service
export async function processTranscript(chunk: TextChunk) {
  const { object } = await generateObject<RefinedTranscript>({
    model,
    schema: refinedTranscriptSchema,
    prompt: refineTranscriptPrompt(chunk.text),
    output: "object",
  });
  return object.refinedContent || object.transcript || chunk.text;
}

export async function analyzeContent(chunk: TextChunk) {
  const { object } = await generateObject<PodcastAnalysis>({
    model,
    schema: contentAnalysisSchema,
    prompt: analyzeContentPrompt(chunk.text),
    output: "object",
  });
  return object;
}

export async function extractEntities(chunk: TextChunk) {
  const { object } = await generateObject<PodcastEntities>({
    model,
    schema: entitySchema,
    prompt: extractEntitiesPrompt(chunk.text),
    output: "object",
  });
  return object;
}
