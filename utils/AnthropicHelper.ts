import Anthropic from "@anthropic-ai/sdk";
import {
  mergeTranscriptAndTemplatePrompt,
  chooseTemplatePrompt,
  suggestTagsPrompt,
  chooseBestTemplatePrompt,
} from "@/prompts/anthropicPrompts";
import { Template } from "@/utils/templateParser";

const CLAUDE_MODEL_VERSION = "claude-3-5-sonnet-20240620";

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

  private static async callClaudeAPI(
    prompt: string,
    maxTokens: number
  ): Promise<string> {
    try {
      const response = await AnthropicHelper.getInstance().messages.create({
        model: CLAUDE_MODEL_VERSION,
        max_tokens: maxTokens || 1000,
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

  static async mergeTranscriptAndTemplate(
    transcript: string,
    template: string
  ): Promise<string> {
    const prompt = mergeTranscriptAndTemplatePrompt(transcript, template);
    return this.callClaudeAPI(prompt, 1000);
  }

  static async chooseAppropriateTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<string> {
    const prompt = chooseTemplatePrompt(transcript, templates);
    return this.callClaudeAPI(prompt, 100);
  }

  static async enrichTemplateWithClaude(
    prompt: string,
    maxTokens: number
  ): Promise<string> {
    return this.callClaudeAPI(prompt, maxTokens);
  }

  static async suggestTagsAndChooseTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<{ bestFit: Template; reasoning: string; optionalChoices: Template[] }> {
    // Step 1: Suggest tags for the transcript
    const tagsPrompt = suggestTagsPrompt(transcript);
    const suggestedTags = await this.callClaudeAPI(tagsPrompt, 100);

    // Step 2: Shortlist likely matches using the tags
    const shortlistedTemplates = templates.filter(template =>
      template.tags.some(tag => suggestedTags.includes(tag))
    );

    // Step 3: Choose the best fit using the content of the transcript and the description and body of the template
    const bestTemplatePrompt = chooseBestTemplatePrompt(transcript, shortlistedTemplates);
    const bestTemplateResponse = await this.callClaudeAPI(bestTemplatePrompt, 1000);

    // Parse the response to get the best fit and optional choices
    const [bestFitId, ...optionalChoiceIds] = bestTemplateResponse.split("\n").map(line => line.trim());
    const bestFit = templates.find(template => template.id === bestFitId);
    const optionalChoices = optionalChoiceIds.map(id => templates.find(template => template.id === id)).filter(Boolean);

    // Return the best fit, reasoning, and optional choices
    return {
      bestFit,
      reasoning: `The best fit was chosen based on the tags: ${suggestedTags} and the content of the transcript.`,
      optionalChoices,
    };
  }
}
