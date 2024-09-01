import { NextRequest, NextResponse } from "next/server";
import { Template } from "@/utils/templateParser";
import { getEnrichJsonPrompt } from "@/prompts/enrichJson";
import { getAnthropicCompletion } from "@/helpers/anthropic";

// Function to enrich a single template
async function enrichTemplate(
  template: Template
): Promise<Template & { tags: string[]; improvedDescription: string }> {
  const prompt = getEnrichJsonPrompt(template);
  const completion = await getAnthropicCompletion(prompt);

  const enrichment = completion.split("\n");
  const tags = enrichment[0].replace("Tags: ", "").split(", ");
  const improvedDescription = enrichment[1].replace("Description: ", "");

  return {
    ...template,
    tags,
    improvedDescription,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { templates } = await req.json();

    if (!templates || !Array.isArray(templates)) {
      return NextResponse.json(
        { error: "Invalid templates provided" },
        { status: 400 }
      );
    }

    // Enrich all templates in the batch
    const enrichedTemplates = await Promise.all(templates.map(enrichTemplate));

    return NextResponse.json(enrichedTemplates);
  } catch (error) {
    console.error("Error enriching templates:", error);
    return NextResponse.json(
      { error: "Error enriching templates" },
      { status: 500 }
    );
  }
}
