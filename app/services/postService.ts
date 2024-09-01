import { Pack, Template, TemplateParser } from "@/utils/templateParser";
import { AnthropicHelper } from "@/utils/AnthropicHelper";

class PostService {
  getPacks(): Pack[] {
    const parser = new TemplateParser();
    return parser.getPacks();
  }

  async chooseTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<Template | null> {
    try {
      const response = await fetch("/api/choose-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript, templates }),
      });

      if (!response.ok) {
        throw new Error("Failed to choose template");
      }

      const { chosenTemplateId } = await response.json();
      return templates.find((t) => t.id === chosenTemplateId) || null;
    } catch (error) {
      console.error("Error choosing template:", error);
      return null;
    }
  }

  async mergeContent(transcript: string, template: string): Promise<string> {
    try {
      const response = await fetch("/api/merge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript, template }),
      });

      if (!response.ok) {
        throw new Error("Failed to merge content");
      }

      const mergedContent = await response.json();
      return mergedContent.result;
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
    const tagsPrompt = suggestTagsPrompt(transcript);
    const suggestedTags = await AnthropicHelper.callClaudeAPI(tagsPrompt, 100);
    return suggestedTags.split(",").map((tag) => tag.trim());
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
    const bestTemplatePrompt = chooseBestTemplatePrompt(transcript, templates);
    const bestTemplateResponse = await AnthropicHelper.callClaudeAPI(
      bestTemplatePrompt,
      1000
    );

    const [bestFitId, ...optionalChoiceIds] = bestTemplateResponse
      .split("\n")
      .map((line) => line.trim());
    const bestFit = templates.find((template) => template.id === bestFitId);
    const optionalChoices = optionalChoiceIds
      .map((id) => templates.find((template) => template.id === id))
      .filter(Boolean);

    return { bestFit, optionalChoices };
  }
}

export const postService = new PostService();
