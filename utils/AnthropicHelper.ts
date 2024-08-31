import Anthropic from "@anthropic-ai/sdk";
import {
  mergeTranscriptAndTemplatePrompt,
  chooseTemplatePrompt,
} from "@/prompts/anthropicPrompts";
import { Template } from "@/utils/templateParser";

export class AnthropicHelper {
  private static anthropic: Anthropic;

  public static getInstance(): Anthropic {
    if (!AnthropicHelper.anthropic) {
      AnthropicHelper.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
    return AnthropicHelper.anthropic;
  }

  static async mergeTranscriptAndTemplate(
    transcript: string,
    template: string
  ): Promise<string> {
    try {
      const response = await AnthropicHelper.getInstance().messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: mergeTranscriptAndTemplatePrompt(transcript, template),
          },
        ],
      });

      return response.content[0].text;
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      throw new Error("Failed to merge content");
    }
  }

  static async chooseAppropriateTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<string> {
    try {
      const response = await AnthropicHelper.getInstance().messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: chooseTemplatePrompt(transcript, templates),
          },
        ],
      });

      return response.content[0].text.trim();
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      throw new Error("Failed to choose template");
    }
  }
}
