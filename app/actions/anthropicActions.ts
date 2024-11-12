"use server";

import { AnthropicHelper } from "@/utils/AnthropicHelper";
import {
  mergeTranscriptAndTemplatePrompt,
  generateTitlePrompt,
  generateImprovedTranscriptPrompt,
  generateSummaryPrompt,
} from "@/prompts/anthropicPrompts";
import { suggestTagsPrompt } from "@/prompts/tagPrompt";
import { chooseBestTemplatePrompt } from "@/prompts/shortlistPrompt";
import { Template } from "@/app/types/template";
import { getSimilarTemplatesPrompt } from "@/prompts/similarTemplatesPrompt";
import {
  extractJsonArrayFromString,
  extractJsonFieldFromString,
} from "@/utils/regexUtils";
import { ContentMetadata } from "@/app/types/contentMetadata";

const anthropicHelper = AnthropicHelper.getInstance();

export async function mergeContent(prompt: string): Promise<string> {
  const mergeResult = await anthropicHelper.getCompletion(prompt);

  // First try to parse as JSON
  try {
    const parsedResult = JSON.parse(mergeResult);
    if (parsedResult.mergedContent) {
      return parsedResult.mergedContent;
    }
  } catch (parseError) {
    console.log("Response is not JSON, attempting to extract content directly");
  }

  // If the response starts with HTML-like content, return it directly
  if (
    mergeResult.trim().startsWith("<p>") ||
    mergeResult.trim().startsWith("<")
  ) {
    return mergeResult.trim();
  }

  // Try regex extraction as a fallback
  const mergedContent = extractJsonFieldFromString(
    mergeResult,
    "mergedContent"
  );
  if (mergedContent) {
    return mergedContent;
  }

  // If all parsing attempts fail, return the raw response if it looks like content
  if (
    mergeResult.length > 0 &&
    !mergeResult.includes("```") &&
    !mergeResult.includes("```json")
  ) {
    return mergeResult.trim();
  }

  console.error(
    "Failed to extract content using all available methods. Raw response:",
    mergeResult
  );
  throw new Error("Failed to parse merged content");
}

export async function suggestTags(
  transcript: string
): Promise<ContentMetadata> {
  const tagsPrompt = suggestTagsPrompt(transcript);
  const tagsResult = await anthropicHelper.getCompletion(tagsPrompt);
  return JSON.parse(tagsResult);
}

export async function chooseBestTemplate(
  transcript: string,
  metadata: ContentMetadata,
  templates: Template[]
) {
  const prompt = chooseBestTemplatePrompt(transcript, metadata, templates);
  return await anthropicHelper.getCompletion(prompt);
}

export async function generateTitle(transcript: string) {
  const titlePrompt = generateTitlePrompt(transcript);
  const titleResponse = await anthropicHelper.getCompletion(titlePrompt, 50);
  const parsedResponse = JSON.parse(titleResponse);
  return parsedResponse.title;
}

export async function generateImprovedTranscript(transcript: string) {
  const improvedTranscriptPrompt = generateImprovedTranscriptPrompt(transcript);
  const improvedTranscriptResponse = await anthropicHelper.getCompletion(
    improvedTranscriptPrompt,
    4096
  );
  const parsedResponse = JSON.parse(improvedTranscriptResponse);
  return parsedResponse.improvedTranscript;
}

export async function generateSummary(transcript: string) {
  const summaryPrompt = generateSummaryPrompt(transcript);
  const summaryResponse = await anthropicHelper.getCompletion(
    summaryPrompt,
    4096
  );
  const parsedResponse = JSON.parse(summaryResponse);
  return parsedResponse.summary;
}

export async function mergeMultipleContents(
  transcript: string,
  templates: Template[],
  metadata: ContentMetadata
): Promise<{
  mergedResults: { templateId: string; mergedContent: string | null }[];
  partialSuccess: boolean;
  failedMergesCount: number;
}> {
  const mergeResults = await Promise.all(
    templates.map(async (template) => {
      const templateBody = template.body || "";
      const prompt = mergeTranscriptAndTemplatePrompt(
        transcript,
        templateBody,
        metadata
      );
      try {
        const mergedContent = await mergeContent(prompt);
        return {
          templateId: template.id,
          mergedContent,
        };
      } catch (error) {
        console.error(
          `Error merging content for template ${template.id}:`,
          error
        );
        return {
          templateId: template.id,
          mergedContent: null,
        };
      }
    })
  );

  return {
    mergedResults: mergeResults,
    partialSuccess: mergeResults.some(
      (result) => result.mergedContent === null
    ),
    failedMergesCount: mergeResults.filter(
      (result) => result.mergedContent === null
    ).length,
  };
}

export async function suggestTitle(transcript: string) {
  const titlePrompt = generateTitlePrompt(transcript);
  const titleResponse = await anthropicHelper.getCompletion(titlePrompt, 50);
  const parsedResponse = JSON.parse(titleResponse);
  return parsedResponse.title;
}

export async function refinePodcastTranscript(prompt: string) {
  const refinedTranscriptResponse = await anthropicHelper.getCompletion(
    prompt,
    4096
  );
  return extractRefinedContent(refinedTranscriptResponse);
}

function extractRefinedContent(response: string): string {
  try {
    const parsedResponse = JSON.parse(response);
    return parsedResponse.refinedContent;
  } catch (parseError) {
    console.error("Error parsing refined transcript:", parseError);
    const contentMatch = response.match(
      /"refinedContent"\s*:\s*"((?:.|\n)*?)(?:"\s*}|$)/
    );
    if (contentMatch && contentMatch[1]) {
      return contentMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n");
    }
    throw new Error("Failed to extract refined content");
  }
}

// {{ edit_start }}
export async function getSimilarTemplates(
  metadata: ContentMetadata,
  templates: Template[]
): Promise<string[]> {
  const prompt = getSimilarTemplatesPrompt(metadata, templates);

  try {
    const response = await anthropicHelper.getCompletion(prompt, 4096);
    try {
      const parsedResponse = JSON.parse(response);
      return parsedResponse.similarTemplateIds;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      // Fallback to regex matching if JSON parsing fails
      return extractJsonArrayFromString(response, "similarTemplateIds");
    }
  } catch (error) {
    console.error("Error fetching similar templates from Anthropic:", error);
    return [];
  }
}
// {{ edit_end }}
