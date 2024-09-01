import { NextRequest, NextResponse } from "next/server";
import { AnthropicHelper } from "@/utils/AnthropicHelper";
import { Template } from "@/utils/templateParser";

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case "chooseBestTemplate": {
        const { transcript, templates } = data;
        const bestTemplateResponse = await AnthropicHelper.chooseBestTemplate(
          transcript,
          templates
        );
        return NextResponse.json({ bestTemplateResponse });
      }
      case "suggestTags": {
        const { transcript } = data;
        const suggestedTags = await AnthropicHelper.suggestTags(transcript);
        return NextResponse.json({ suggestedTags });
      }
      case "mergeContent": {
        const { transcript, template } = data;
        const mergedContent = await AnthropicHelper.mergeTranscriptAndTemplate(
          transcript,
          template
        );
        return NextResponse.json({ mergedContent });
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
