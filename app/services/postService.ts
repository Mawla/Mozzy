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

  async mergeContent(transcript: string, template: string): Promise<string> {
    try {
      const { mergedContent } = await this.callAPI<{ mergedContent: string }>(
        "mergeContent",
        { transcript, template }
      );
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
    return templates.filter((template) =>
      template.tags.some((tag) => tags.includes(tag))
    );
  }

  async chooseBestTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<{ bestFit: Template; optionalChoices: Template[] }> {
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
        .filter(Boolean);

      // Return the best fit template and the optional choices
      if (!bestFitTemplate) {
        throw new Error("No best fit template found");
      }
      return {
        bestFit: bestFitTemplate,
        optionalChoices: optionalChoiceTemplates as Template[],
      };
    } catch (error) {
      console.error("Error choosing best template:", error);
      // Return null for bestFit and an empty array for optionalChoices in case of an error
      return { bestFit: {} as Template, optionalChoices: [] };
    }
  }
}

export const postService = new PostService();
