import { AnthropicHelper } from "@/utils/AnthropicHelper";

export async function getAnthropicCompletion(prompt: string): Promise<string> {
  try {
    const response = await AnthropicHelper.getInstance().messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error("Error calling Anthropic API:", error);
    throw new Error("Failed to get completion from Anthropic");
  }
}
