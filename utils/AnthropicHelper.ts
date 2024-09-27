import Anthropic from "@anthropic-ai/sdk";

const CLAUDE_MODEL_VERSION = "claude-3-5-sonnet-20240620";

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
    maxTokens: number = 4096
  ): Promise<string> {
    try {
      console.log("Calling Anthropic API with prompt:", prompt);
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
