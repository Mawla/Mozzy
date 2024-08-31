import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getAnthropicCompletion } from "../helpers/anthropic";
import { getEnrichJsonPrompt } from "../prompts/enrichJson";

export async function POST() {
  try {
    const jsonPath = path.join(
      process.cwd(),
      "public",
      "packs",
      "alltemplates.json"
    );
    const jsonContent = await fs.readFile(jsonPath, "utf-8");
    const templates = JSON.parse(jsonContent).result.data.json;

    const enrichedTemplates = await Promise.all(
      templates.map(async (template) => {
        const enrichedTemplate = await enrichTemplate(template);
        return enrichedTemplate;
      })
    );

    return NextResponse.json(enrichedTemplates);
  } catch (error) {
    console.error("Error enriching JSON:", error);
    return NextResponse.json(
      { error: "Failed to enrich JSON" },
      { status: 500 }
    );
  }
}

async function enrichTemplate(template) {
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
