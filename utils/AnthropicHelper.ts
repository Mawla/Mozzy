import Anthropic from "@anthropic-ai/sdk";
import {
  mergeTranscriptAndTemplatePrompt,
  suggestTagsPrompt,
  chooseBestTemplatePrompt,
} from "@/prompts/anthropicPrompts";
import { Template } from "@/utils/templateParser";

const CLAUDE_MODEL_VERSION = "claude-3-5-sonnet-20240620";

interface AnthropicHelperInterface {
  getInstance(): Anthropic;
  getCompletion(prompt: string, maxTokens?: number): Promise<string>;
  mergeTranscriptAndTemplate(
    transcript: string,
    template: string
  ): Promise<string>;
  chooseBestTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<string>;
  suggestTags(transcript: string): Promise<string[]>;
  enrichTemplateWithClaude(prompt: string, maxTokens: number): Promise<string>;
}

export class AnthropicHelper implements AnthropicHelperInterface {
  private static instance: AnthropicHelper;
  private anthropic: Anthropic;

  private constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  public static getInstance(): AnthropicHelper {
    if (!AnthropicHelper.instance) {
      AnthropicHelper.instance = new AnthropicHelper();
    }
    return AnthropicHelper.instance;
  }

  public getInstance(): Anthropic {
    return this.anthropic;
  }

  public async getCompletion(
    prompt: string,
    maxTokens: number = 1000
  ): Promise<string> {
    return this.callClaudeAPI(prompt, maxTokens);
  }

  private async callClaudeAPI(
    prompt: string,
    maxTokens: number
  ): Promise<string> {
    try {
      const response = await this.anthropic.messages.create({
        model: CLAUDE_MODEL_VERSION,
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      if (
        response.content &&
        response.content.length > 0 &&
        "text" in response.content[0]
      ) {
        return response.content[0].text.trim();
      } else {
        throw new Error("Invalid response format from Claude API");
      }
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      throw new Error("Failed to call Claude API");
    }
  }

  public async mergeTranscriptAndTemplate(
    transcript: string,
    template: string
  ): Promise<string> {
    const prompt = mergeTranscriptAndTemplatePrompt(transcript, template);
    return this.callClaudeAPI(prompt, 1000);
  }

  public async chooseBestTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<string> {
    const prompt = chooseBestTemplatePrompt(transcript, templates);
    console.log("chooseBestTemplate prompt:", prompt);
    const response = await this.callClaudeAPI(prompt, 1000);
    console.log("chooseBestTemplate response:", response);
    return response;
  }

  public async suggestTags(transcript: string): Promise<string[]> {
    const prompt = suggestTagsPrompt(transcript);
    const response = await this.callClaudeAPI(prompt, 100);
    return response.split(",").map((tag) => tag.trim());
  }

  public async enrichTemplateWithClaude(
    prompt: string,
    maxTokens: number
  ): Promise<string> {
    return this.callClaudeAPI(prompt, maxTokens);
  }
}
