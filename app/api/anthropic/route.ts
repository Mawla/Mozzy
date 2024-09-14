import { NextRequest, NextResponse } from "next/server";
import { AnthropicHelper } from "@/utils/AnthropicHelper";
import {
  mergeTranscriptAndTemplatePrompt,
  suggestTagsPrompt,
  chooseBestTemplatePrompt,
  generateTitlePrompt,
  generateImprovedTranscriptPrompt,
  generateSummaryPrompt,
} from "@/prompts/anthropicPrompts";
import { Template } from "@/app/types/template";

interface AnthropicRequest {
  action:
    | "mergeContent"
    | "suggestTags"
    | "chooseBestTemplate"
    | "generateTitle"
    | "generateImprovedTranscript"
    | "generateSummary"
    | "mergeMultipleContents"; // Add this new action
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
  bestTemplatesResponse: string;
}

export async function POST(request: NextRequest) {
  try {
    const { action, data }: AnthropicRequest = await request.json();
    console.log("Received request:", { action, data });

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
        const prompt = chooseBestTemplatePrompt(transcript, templates);
        const chooseBestTemplateResponse = await anthropicHelper.getCompletion(
          prompt
        );
        return NextResponse.json({
          bestTemplatesResponse: chooseBestTemplateResponse,
        });
      }
      case "generateTitle": {
        const { transcript } = data;
        if (!transcript) {
          return NextResponse.json(
            { error: "Missing transcript" },
            { status: 400 }
          );
        }
        console.log(
          "Generating title for transcript:",
          transcript.slice(0, 100) + "..."
        );
        const titlePrompt = generateTitlePrompt(transcript);
        console.log("Title prompt:", titlePrompt);
        try {
          const titleResponse = await anthropicHelper.getCompletion(
            titlePrompt,
            50
          );
          console.log("Raw title response:", titleResponse);
          let parsedResponse;
          try {
            parsedResponse = JSON.parse(titleResponse);
          } catch (parseError) {
            console.error("Error parsing title response:", parseError);
            return NextResponse.json(
              {
                error: "Failed to parse title response",
                details: (parseError as Error).message,
                rawResponse: titleResponse,
              },
              { status: 500 }
            );
          }
          console.log("Generated title:", parsedResponse.title);
          return NextResponse.json({ suggestedTitle: parsedResponse.title });
        } catch (error) {
          console.error("Error generating title:", error);
          return NextResponse.json(
            {
              error: "Failed to generate title",
              details: (error as Error).message,
            },
            { status: 500 }
          );
        }
      }
      case "generateImprovedTranscript": {
        const { transcript } = data;
        if (!transcript) {
          return NextResponse.json(
            { error: "Missing transcript" },
            { status: 400 }
          );
        }
        const improvedTranscriptPrompt =
          generateImprovedTranscriptPrompt(transcript);
        try {
          const improvedTranscriptResponse =
            await anthropicHelper.getCompletion(improvedTranscriptPrompt, 500);
          const parsedResponse = JSON.parse(improvedTranscriptResponse);
          return NextResponse.json({
            improvedTranscript: parsedResponse.improvedTranscript,
          });
        } catch (error) {
          console.error("Error generating improved transcript:", error);
          return NextResponse.json(
            {
              error: "Failed to generate improved transcript",
              details: (error as Error).message,
            },
            { status: 500 }
          );
        }
      }
      case "generateSummary": {
        const { transcript } = data;
        if (!transcript) {
          return NextResponse.json(
            { error: "Missing transcript" },
            { status: 400 }
          );
        }
        console.log(
          "Generating summary for transcript:",
          transcript.slice(0, 100) + "..."
        );
        const summaryPrompt = generateSummaryPrompt(transcript);
        console.log("Summary prompt:", summaryPrompt);
        try {
          const summaryResponse = await anthropicHelper.getCompletion(
            summaryPrompt,
            150
          );
          const parsedResponse = JSON.parse(summaryResponse);
          console.log("Generated summary:", parsedResponse.summary);
          return NextResponse.json({ summary: parsedResponse.summary });
        } catch (error) {
          console.error("Error generating summary:", error);
          return NextResponse.json(
            {
              error: "Failed to generate summary",
              details: (error as Error).message,
            },
            { status: 500 }
          );
        }
      }
      case "suggestTitle": {
        const { transcript } = data;
        if (!transcript) {
          return NextResponse.json(
            { error: "Missing transcript" },
            { status: 400 }
          );
        }
        console.log(
          "Generating title for transcript:",
          transcript.slice(0, 100) + "..."
        );
        const titlePrompt = generateTitlePrompt(transcript);
        console.log("Title prompt:", titlePrompt);
        try {
          const titleResponse = await anthropicHelper.getCompletion(
            titlePrompt,
            50
          );
          console.log("Raw title response:", titleResponse);
          let parsedResponse;
          try {
            parsedResponse = JSON.parse(titleResponse);
          } catch (parseError) {
            console.error("Error parsing title response:", parseError);
            return NextResponse.json(
              {
                error: "Failed to parse title response",
                details: (parseError as Error).message,
                rawResponse: titleResponse,
              },
              { status: 500 }
            );
          }
          console.log("Generated title:", parsedResponse.title);
          return NextResponse.json({ suggestedTitle: parsedResponse.title });
        } catch (error) {
          console.error("Error generating title:", error);
          return NextResponse.json(
            {
              error: "Failed to generate title",
              details: (error as Error).message,
            },
            { status: 500 }
          );
        }
      }
      case "mergeMultipleContents": {
        const { transcript, templates } = data;
        if (!transcript || !templates || !Array.isArray(templates)) {
          return NextResponse.json(
            { error: "Invalid input for mergeMultipleContents" },
            { status: 400 }
          );
        }
        try {
          const mergeResults = await Promise.allSettled(
            templates.map(async (template) => {
              try {
                const templateBody = template.body || "";
                const prompt = mergeTranscriptAndTemplatePrompt(
                  transcript,
                  templateBody
                );
                const response = await anthropicHelper.getCompletion(prompt);
                return JSON.parse(response);
              } catch (error) {
                console.error(
                  `Error merging content for template ${template.id}:`,
                  error
                );
                return null;
              }
            })
          );

          const successfulMerges = mergeResults
            .filter(
              (result): result is PromiseFulfilledResult<any> =>
                result.status === "fulfilled" && result.value !== null
            )
            .map((result) => result.value);

          const failedMergesCount =
            mergeResults.length - successfulMerges.length;

          if (successfulMerges.length === 0) {
            return NextResponse.json(
              {
                error: "Failed to merge any content",
                details: `All ${failedMergesCount} merge attempts failed.`,
              },
              { status: 500 }
            );
          }

          return NextResponse.json({
            mergedResults: successfulMerges,
            partialSuccess: failedMergesCount > 0,
            failedMergesCount,
          });
        } catch (error) {
          console.error("Error in mergeMultipleContents:", error);
          return NextResponse.json(
            {
              error: "Failed to process merge request",
              details: (error as Error).message,
            },
            { status: 500 }
          );
        }
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in anthropic API route:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: (error as Error).message },
      { status: 500 }
    );
  }
}
