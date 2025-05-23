import Anthropic from "@anthropic-ai/sdk";

const CLAUDE_MODEL_VERSION = "claude-3-7-sonnet-20250219";
const MAX_OUTPUT_TOKENS = 10000; // Maximum allowed for Claude 3 Sonnet

export class AnthropicHelper {
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

  public async getCompletion(
    prompt: string,
    maxTokens: number = MAX_OUTPUT_TOKENS
  ): Promise<string> {
    try {
      console.log("Calling Anthropic API with prompt:", prompt);
      const response = await this.anthropic.messages.create({
        model: CLAUDE_MODEL_VERSION,
        max_tokens: Math.min(maxTokens, MAX_OUTPUT_TOKENS), // Ensure we don't exceed the limit
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      console.log("Anthropic API response:", response);

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
      if (error instanceof Anthropic.APIError) {
        console.error("Anthropic API Error details:", error.error);
      }
      throw new Error(`Failed to call Claude API: ${(error as Error).message}`);
    }
  }
}
