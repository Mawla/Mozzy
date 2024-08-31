import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getAnthropicCompletion(prompt: string): Promise<string> {
  const response = await anthropic.completions.create({
    model: "claude-2",
    prompt: prompt,
    max_tokens_to_sample: 150,
    temperature: 0.7,
  });

  return response.completion.trim();
}
