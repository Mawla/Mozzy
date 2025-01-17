import { NextRequest, NextResponse } from "next/server";
import * as AnthropicActions from "@/app/actions/anthropicActions";
import {
  mergeTranscriptAndTemplatePrompt,
  generateSummaryPrompt,
  generateImprovedTranscriptPrompt,
  generateTitlePrompt,
} from "@/prompts/anthropicPrompts";

// Define a type for the response structure
type ApiResponse<T> = {
  data?: T;
  error?: string;
  details?: string;
};

// Helper function to handle errors
function handleError(error: unknown): ApiResponse<never> {
  console.error("Error in anthropic API route:", error);
  return {
    error: "Failed to process request",
    details: error instanceof Error ? error.message : String(error),
  };
}

// Helper function to create a successful response
function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { data };
}

// Separate route handlers for each action
export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case "mergeContent":
        const prompt = mergeTranscriptAndTemplatePrompt(
          data.transcript,
          data.template,
          data.metadata || {
            categories: [],
            tags: [],
            topics: [],
            keyPeople: [],
            industries: [],
            contentType: [],
          }
        );
        return NextResponse.json(
          createSuccessResponse(await AnthropicActions.mergeContent(prompt))
        );
      case "suggestTags":
        return NextResponse.json(
          createSuccessResponse(
            await AnthropicActions.suggestTags(data.transcript)
          )
        );
      case "chooseBestTemplate":
        return NextResponse.json(
          createSuccessResponse(
            await AnthropicActions.chooseBestTemplate(
              data.transcript,
              data.metadata || {
                categories: [],
                tags: [],
                topics: [],
                keyPeople: [],
                industries: [],
                contentType: [],
              },
              data.templates
            )
          )
        );
      case "generateTitle":
        return NextResponse.json(
          createSuccessResponse(
            await AnthropicActions.generateTitle(
              generateTitlePrompt(data.transcript)
            )
          )
        );
      case "generateImprovedTranscript":
        return NextResponse.json(
          createSuccessResponse(
            await AnthropicActions.generateImprovedTranscript(
              generateImprovedTranscriptPrompt(data.transcript)
            )
          )
        );
      case "generateSummary":
        return NextResponse.json(
          createSuccessResponse(
            await AnthropicActions.generateSummary(
              generateSummaryPrompt(data.transcript)
            )
          )
        );
      case "mergeMultipleContents":
        return NextResponse.json(
          createSuccessResponse(
            await AnthropicActions.mergeMultipleContents(
              data.transcript,
              data.templates,
              data.metadata || {
                categories: [],
                tags: [],
                topics: [],
                keyPeople: [],
                industries: [],
                contentType: [],
              }
            )
          )
        );
      case "suggestTitle":
        return NextResponse.json(
          createSuccessResponse(
            await AnthropicActions.suggestTitle(data.transcript)
          )
        );
      case "refinePodcastTranscript":
        return NextResponse.json(
          createSuccessResponse(
            await AnthropicActions.refinePodcastTranscript(data.prompt)
          )
        );
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
