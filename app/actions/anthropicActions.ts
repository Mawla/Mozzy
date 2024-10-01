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
import { extractJsonFieldFromString } from "@/utils/regexUtils";

const anthropicHelper = AnthropicHelper.getInstance();

export async function mergeContent(transcript: string, template: string) {
  const mergePrompt = mergeTranscriptAndTemplatePrompt(transcript, template);
  const mergeResult = await anthropicHelper.getCompletion(mergePrompt);
  return JSON.parse(mergeResult);
}

export async function suggestTags(transcript: string) {
  const tagsPrompt = suggestTagsPrompt(transcript);
  const tagsResult = await anthropicHelper.getCompletion(tagsPrompt);
  return tagsResult.split(",").map((tag) => tag.trim());
}

export async function chooseBestTemplate(
  transcript: string,
  templates: Template[]
) {
  const prompt = chooseBestTemplatePrompt(transcript, templates);
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
  templates: Template[]
): Promise<{
  mergedResults: { templateId: string; mergedContent: string }[];
  partialSuccess: boolean;
  failedMergesCount: number;
}> {
  const mergeResults = await Promise.all(
    templates.map(async (template) => {
      const templateBody = template.body || "";
      const prompt = mergeTranscriptAndTemplatePrompt(transcript, templateBody);
      const response = await anthropicHelper.getCompletion(prompt);

      // {{ edit_start }}
      let mergedContent: string | null = null;
      try {
        const parsedResponse = JSON.parse(response);
        mergedContent = parsedResponse.mergedContent;
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        mergedContent = extractJsonFieldFromString(response, "mergedContent");
        if (!mergedContent) {
          console.error(
            "Failed to extract 'mergedContent' using regex fallback."
          );
        }
      }
      // {{ edit_end }}

      return {
        templateId: template.id,
        mergedContent: mergedContent,
      };
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
  tags: string[],
  templates: { id: string; tags: string[] }[]
): Promise<string[]> {
  const prompt = getSimilarTemplatesPrompt(tags, templates);

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
