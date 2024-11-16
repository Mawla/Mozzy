import { NextResponse } from "next/server";
import { refinePodcastTranscript } from "@/app/actions/anthropicActions";

export async function POST(request: Request) {
  try {
    const { content, type } = await request.json();

    if (type !== "transcript") {
      return NextResponse.json(
        { error: "Only transcript processing is currently supported" },
        { status: 400 }
      );
    }

    const result = await refinePodcastTranscript(content);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error processing podcast:", error);
    return NextResponse.json(
      { error: "Failed to process podcast" },
      { status: 500 }
    );
  }
}
