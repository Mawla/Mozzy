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
import { extractJsonArrayFromString } from "@/utils/regexUtils";
import { ContentMetadata } from "@/app/types/contentMetadata";
import {
  unescapeJsonString,
  sanitizeJsonString,
  extractJsonFieldFromString,
} from "@/utils/stringUtils";

const anthropicHelper = AnthropicHelper.getInstance();

// Define constants for magic numbers
const DEFAULT_COMPLETION_LENGTH = 8192;
const TITLE_COMPLETION_LENGTH = 50;
const SIMILAR_TEMPLATES_COMPLETION_LENGTH = 4096;

export async function mergeContent(prompt: string): Promise<string> {
  const mergeResult = await anthropicHelper.getCompletion(
    prompt,
    DEFAULT_COMPLETION_LENGTH
  );

  // First try to parse as JSON
  try {
    const sanitizedResult = sanitizeJsonString(mergeResult);
    const parsedResult = JSON.parse(sanitizedResult);
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
  const tagsResult = await anthropicHelper.getCompletion(
    tagsPrompt,
    DEFAULT_COMPLETION_LENGTH
  );
  const sanitizedTagsResult = sanitizeJsonString(tagsResult);
  return JSON.parse(sanitizedTagsResult);
}

export async function chooseBestTemplate(
  transcript: string,
  metadata: ContentMetadata,
  templates: Template[]
) {
  const prompt = chooseBestTemplatePrompt(transcript, metadata, templates);
  const result = await anthropicHelper.getCompletion(
    prompt,
    DEFAULT_COMPLETION_LENGTH
  );
  const sanitizedResult = sanitizeJsonString(result);
  return JSON.parse(sanitizedResult);
}

export async function generateTitle(transcript: string) {
  const titlePrompt = generateTitlePrompt(transcript);
  const titleResponse = await anthropicHelper.getCompletion(
    titlePrompt,
    TITLE_COMPLETION_LENGTH
  );
  const sanitizedTitleResponse = sanitizeJsonString(titleResponse);
  const parsedResponse = JSON.parse(sanitizedTitleResponse);
  return parsedResponse.title;
}

export async function generateImprovedTranscript(transcript: string) {
  const improvedTranscriptPrompt = generateImprovedTranscriptPrompt(transcript);
  const improvedTranscriptResponse = await anthropicHelper.getCompletion(
    improvedTranscriptPrompt,
    DEFAULT_COMPLETION_LENGTH
  );
  const sanitizedImprovedTranscriptResponse = sanitizeJsonString(
    improvedTranscriptResponse
  );
  const parsedResponse = JSON.parse(sanitizedImprovedTranscriptResponse);
  return parsedResponse.improvedTranscript;
}

export async function generateSummary(transcript: string) {
  const summaryPrompt = generateSummaryPrompt(transcript);
  const summaryResponse = await anthropicHelper.getCompletion(
    summaryPrompt,
    DEFAULT_COMPLETION_LENGTH
  );
  const sanitizedSummaryResponse = sanitizeJsonString(summaryResponse);
  const parsedResponse = JSON.parse(sanitizedSummaryResponse);
  return parsedResponse.summary;
}

export async function getSimilarTemplates(
  metadata: ContentMetadata,
  templates: Template[]
): Promise<string[]> {
  const prompt = getSimilarTemplatesPrompt(metadata, templates);

  try {
    const response = await anthropicHelper.getCompletion(
      prompt,
      SIMILAR_TEMPLATES_COMPLETION_LENGTH
    );
    const sanitizedResponse = sanitizeJsonString(response);
    try {
      const parsedResponse = JSON.parse(sanitizedResponse);
      return parsedResponse.similarTemplateIds;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      // Fallback to regex matching if JSON parsing fails
      return extractJsonArrayFromString(
        sanitizedResponse,
        "similarTemplateIds"
      );
    }
  } catch (error) {
    console.error("Error fetching similar templates from Anthropic:", error);
    return [];
  }
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
  const titleResponse = await anthropicHelper.getCompletion(
    titlePrompt,
    TITLE_COMPLETION_LENGTH
  );
  const sanitizedTitleResponse = sanitizeJsonString(titleResponse);
  const parsedResponse = JSON.parse(sanitizedTitleResponse);
  return parsedResponse.title;
}

export async function refinePodcastTranscript(prompt: string): Promise<string> {
  const refinedTranscriptResponse = await anthropicHelper.getCompletion(
    prompt,
    DEFAULT_COMPLETION_LENGTH
  );
  return extractRefinedContent(refinedTranscriptResponse);
}

/**
 * Extracts refined content from API response with enhanced error handling
 */
function extractRefinedContent(response: string): string {
  try {
    // First attempt: Try parsing the sanitized JSON
    const sanitizedResponse = sanitizeJsonString(response);
    const parsedResponse = JSON.parse(sanitizedResponse);

    if (typeof parsedResponse === "object" && parsedResponse?.refinedContent) {
      return parsedResponse.refinedContent;
    }

    // If the first attempt fails, try the fallback regex approach
    throw new Error("Invalid response structure");
  } catch (parseError) {
    console.error("Initial parsing failed:", parseError);

    try {
      // Second attempt: Try regex-based extraction with improved pattern
      const refinedContent = extractJsonFieldFromString(
        response,
        "refinedContent"
      );
      if (refinedContent) {
        return refinedContent;
      }

      // If all attempts fail, throw a detailed error
      throw new Error("Could not extract refined content using any method");
    } catch (extractionError) {
      console.error("Extraction attempts failed:", extractionError);
      console.error("Raw response excerpt:", response.slice(0, 200) + "...");

      throw new Error(
        `Failed to extract refined content: ${
          (extractionError as Error).message
        }`
      );
    }
  }
}
