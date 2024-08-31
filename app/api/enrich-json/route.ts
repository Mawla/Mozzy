import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getAnthropicCompletion } from "@/helpers/anthropic";
import { Template } from "@/utils/templateParser";
import { getEnrichJsonPrompt } from "@/prompts/enrichJson";

export async function POST(request: Request) {
  try {
    const { start, end } = await request.json();

    const jsonPath = path.join(
      process.cwd(),
      "public",
      "packs",
      "alltemplates.json"
    );
    const jsonContent = await fs.readFile(jsonPath, "utf-8");
    const templates = JSON.parse(jsonContent).result.data.json;

    const enrichedTemplates = [];
    for (let i = start; i < Math.min(end, templates.length); i++) {
      const enrichedTemplate = await enrichTemplate(templates[i]);
      enrichedTemplates.push(enrichedTemplate);
    }

    return NextResponse.json(enrichedTemplates);
  } catch (error) {
    console.error("Error enriching JSON:", error);
    return NextResponse.json(
      { error: "Failed to enrich JSON" },
      { status: 500 }
    );
  }
}

async function enrichTemplate(template: Template) {
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
