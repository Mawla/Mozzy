import { NextResponse } from "next/server";
import { AnthropicHelper } from "@/utils/AnthropicHelper";

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const { transcript, template } = await req.json();

      const mergedContent = await AnthropicHelper.mergeTranscriptAndTemplate(
        transcript,
        template
      );

      return NextResponse.json({ result: mergedContent });
    } catch (error) {
      console.error("Error merging content:", error);
      return NextResponse.json(
        { error: "Failed to merge content" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
