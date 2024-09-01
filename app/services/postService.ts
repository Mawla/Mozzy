import { Pack, Template, TemplateParser } from "@/utils/templateParser";

class PostService {
  getPacks(): Pack[] {
    const parser = new TemplateParser();
    return parser.getPacks();
  }

  async mergeContent(transcript: string, template: string): Promise<string> {
    try {
      // Call the unified API route to merge content
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "mergeContent",
          data: { transcript, template },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to merge content");
      }

      const { mergedContent } = await response.json();
      return mergedContent;
    } catch (error) {
      console.error("Error merging content:", error);
      throw error;
    }
  }

  saveToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  saveTemplateToLocalStorage(template: Template): void {
    localStorage.setItem("selectedTemplate", JSON.stringify(template));
  }

  getTemplateFromLocalStorage(): Template | null {
    const savedTemplate = localStorage.getItem("selectedTemplate");
    return savedTemplate ? JSON.parse(savedTemplate) : null;
  }

  async clearPostData(): Promise<void> {
    localStorage.removeItem("transcript");
    localStorage.removeItem("template");
    localStorage.removeItem("content");
    localStorage.removeItem("merge");
    localStorage.removeItem("selectedTemplate");
    // Add any other items that need to be cleared
  }

  async suggestTags(transcript: string): Promise<string[]> {
    try {
      // Call the unified API route to get suggested tags
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "suggestTags", data: { transcript } }),
      });

      if (!response.ok) {
        throw new Error("Failed to suggest tags");
      }

      const { suggestedTags } = await response.json();
      return suggestedTags;
    } catch (error) {
      console.error("Error suggesting tags:", error);
      return [];
    }
  }

  async shortlistTemplatesByTags(
    tags: string[],
    templates: Template[]
  ): Promise<Template[]> {
    return templates.filter((template) =>
      template.tags.some((tag) => tags.includes(tag))
    );
  }

  async chooseBestTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<{ bestFit: Template; optionalChoices: Template[] }> {
    try {
      // Call the unified API route to get the best template response
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "chooseBestTemplate",
          data: { transcript, templates },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to choose best template");
      }

      const { bestTemplateResponse } = await response.json();

      // Parse the response to get the best fit template ID and optional choice IDs
      const [bestFitId, ...optionalChoiceIds] = bestTemplateResponse
        .split("\n")
        .map((line) => line.trim());

      // Find the best fit template from the list of templates
      const bestFit = templates.find((template) => template.id === bestFitId);

      // Find the optional choice templates from the list of templates
      const optionalChoices = optionalChoiceIds
        .map((id) => templates.find((template) => template.id === id))
        .filter(Boolean);

      // Return the best fit template and the optional choices
      if (!bestFit) {
        throw new Error("No best fit template found");
      }
      return { bestFit, optionalChoices: optionalChoices as Template[] };
    } catch (error) {
      console.error("Error choosing best template:", error);
      // Return null for bestFit and an empty array for optionalChoices in case of an error
      return { bestFit: {} as Template, optionalChoices: [] };
    }
  }
}

export const postService = new PostService();
