import { Pack, Template, TemplateParser } from "@/utils/templateParser";

class PostService {
  getPacks(): Pack[] {
    const parser = new TemplateParser();
    return parser.getPacks();
  }

  private async callAPI<T>(action: string, data: any): Promise<T> {
    try {
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, data }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error in ${action} API call:`, error);
      throw error;
    }
  }

  async mergeContent(
    transcript: string,
    template: string
  ): Promise<{ mergedContent: string; suggestedTitle: string }> {
    try {
      const response = await this.callAPI<{
        mergedContent: string;
        suggestedTitle: string;
      }>("mergeContent", {
        transcript,
        template,
        prompt:
          "Please merge the provided transcript and template. Also, suggest a compelling title for the merged content.",
      });

      if (!response.mergedContent || !response.suggestedTitle) {
        throw new Error("Invalid response from mergeContent API");
      }

      return {
        mergedContent: response.mergedContent,
        suggestedTitle: response.suggestedTitle,
      };
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
      const { suggestedTags } = await this.callAPI<{ suggestedTags: string[] }>(
        "suggestTags",
        { transcript }
      );
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
    // Normalize tags (remove '#' if present and convert to lowercase)
    const normalizedTags = tags.map((tag) =>
      tag.replace("#", "").toLowerCase()
    );

    // Filter and sort templates
    const shortlistedTemplates = templates
      .map((template) => {
        const templateTags = template.tags.map((tag) => tag.toLowerCase());
        const matchingTags = normalizedTags.filter((tag) =>
          templateTags.includes(tag)
        );
        return { template, matchCount: matchingTags.length };
      })
      .filter((item) => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 10) // Take only the top 10 matches
      .map((item) => item.template);

    // Return the top 10 matching templates, or all matching templates if less than 10
    return shortlistedTemplates.length > 0
      ? shortlistedTemplates
      : templates.slice(0, 10);
  }

  async chooseBestTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<{ bestFit: Template | null; optionalChoices: Template[] }> {
    try {
      const response = await this.callAPI<{
        bestTemplateResponse: string;
      }>("chooseBestTemplate", { transcript, templates });

      console.log("API response:", response);

      // Parse the inner JSON string
      const parsedResponse = JSON.parse(response.bestTemplateResponse);

      console.log("Parsed response:", parsedResponse);

      // Extract template and choices from the parsed response
      const bestFitId = parsedResponse.template;
      const optionalChoiceIds = parsedResponse.choices || [];

      // Find the best fit template from the list of templates
      const bestFitTemplate = templates.find(
        (template) => template.id === bestFitId
      );

      // Find the optional choice templates from the list of templates
      const optionalChoiceTemplates = optionalChoiceIds
        .map((id: string) => templates.find((template) => template.id === id))
        .filter(Boolean) as Template[];

      console.log("Best fit template:", bestFitTemplate);
      console.log("Optional choices:", optionalChoiceTemplates);

      // Return the best fit template and the optional choices
      return {
        bestFit: bestFitTemplate || null,
        optionalChoices: optionalChoiceTemplates,
      };
    } catch (error) {
      console.error("Error choosing best template:", error);
      // Return null for bestFit and an empty array for optionalChoices in case of an error
      return { bestFit: null, optionalChoices: [] };
    }
  }

  saveSuggestedTagsToLocalStorage(tags: string[]): void {
    console.log("Saving tags to localStorage:", tags); // Debug log
    localStorage.setItem("suggestedTags", JSON.stringify(tags));
  }

  getSuggestedTagsFromLocalStorage(): string[] {
    const savedTags = localStorage.getItem("suggestedTags");
    return savedTags ? JSON.parse(savedTags) : [];
  }

  async postToLinkedIn(title: string, content: string): Promise<void> {
    try {
      const response = await this.callAPI<{ success: boolean }>(
        "postToLinkedIn",
        { title, content }
      );
      if (!response.success) {
        throw new Error("Failed to post to LinkedIn");
      }
    } catch (error) {
      console.error("Error posting to LinkedIn:", error);
      throw error;
    }
  }
}

export const postService = new PostService();
