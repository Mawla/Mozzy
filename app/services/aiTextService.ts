import { AnthropicHelper } from "@/utils/AnthropicHelper";
import {
  generateSummaryPrompt,
  generateImprovedTranscriptPrompt,
} from "@/prompts/anthropicPrompts";

export async function generateImprovedTranscript(
  transcript: string
): Promise<string> {
  try {
    const response = await fetch("/api/anthropic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "generateImprovedTranscript",
        data: { transcript },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.improvedTranscript;
  } catch (error) {
    console.error("Error generating improved transcript:", error);
    throw error;
  }
}

export async function generateTitle(transcript: string): Promise<string> {
  try {
    const response = await fetch("/api/anthropic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "generateTitle",
        data: { transcript },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.error}, details: ${errorData.details}`
      );
    }

    const data = await response.json();
    return data.title;
  } catch (error) {
    console.error("Error generating title:", error);
    throw error;
  }
}
