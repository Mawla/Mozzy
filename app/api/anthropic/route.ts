import { NextRequest, NextResponse } from "next/server";
import { AnthropicHelper } from "@/utils/AnthropicHelper";
import {
  mergeTranscriptAndTemplatePrompt,
  suggestTagsPrompt,
  chooseBestTemplatePrompt,
} from "@/prompts/anthropicPrompts";
import { Template } from "@/utils/templateParser";

interface AnthropicRequest {
  action: "mergeContent" | "suggestTags" | "chooseBestTemplate";
  data: {
    transcript?: string;
    template?: string;
    templates?: Template[];
  };
}

interface MergeContentResponse {
  mergedContent: string;
  suggestedTitle: string;
}

interface SuggestTagsResponse {
  suggestedTags: string[];
}

interface ChooseBestTemplateResponse {
  bestTemplateResponse: string;
}

export async function POST(request: NextRequest) {
  try {
    const { action, data }: AnthropicRequest = await request.json();
    const anthropicHelper = AnthropicHelper.getInstance();

    switch (action) {
      case "mergeContent": {
        const { transcript, template } = data;
        if (!transcript || !template) {
          return NextResponse.json(
            { error: "Missing transcript or template" },
            { status: 400 }
          );
        }
        const mergePrompt = mergeTranscriptAndTemplatePrompt(
          transcript,
          template
        );
        const mergeResult = await anthropicHelper.getCompletion(mergePrompt);
        const parsedResult: MergeContentResponse = JSON.parse(mergeResult);
        return NextResponse.json(parsedResult);
      }
      case "suggestTags": {
        const { transcript } = data;
        if (!transcript) {
          return NextResponse.json(
            { error: "Missing transcript" },
            { status: 400 }
          );
        }
        const tagsPrompt = suggestTagsPrompt(transcript);
        const tagsResult = await anthropicHelper.getCompletion(tagsPrompt);
        const suggestedTags = tagsResult.split(",").map((tag) => tag.trim());
        const response: SuggestTagsResponse = { suggestedTags };
        return NextResponse.json(response);
      }
      case "chooseBestTemplate": {
        const { transcript, templates } = data;
        if (!transcript || !templates) {
          return NextResponse.json(
            { error: "Missing transcript or templates" },
            { status: 400 }
          );
        }
        const templatePrompt = chooseBestTemplatePrompt(transcript, templates);
        const bestTemplateResponse = await anthropicHelper.getCompletion(
          templatePrompt
        );
        const response: ChooseBestTemplateResponse = { bestTemplateResponse };
        return NextResponse.json(response);
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in anthropic API route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
