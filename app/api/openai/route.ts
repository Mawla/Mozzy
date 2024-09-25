import { NextRequest, NextResponse } from "next/server";
import openai from "@/app/lib/openai";

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json(
      { error: "No request body provided" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const audioBlob = formData.get("file") as Blob;

    if (!audioBlob) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return NextResponse.json({ transcript: transcription.text });
  } catch (error) {
    console.error("Error in OpenAI route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
