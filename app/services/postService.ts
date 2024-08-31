import { Pack, Template, TemplateParser } from "@/utils/templateParser";

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
}

export const postService = new PostService();
