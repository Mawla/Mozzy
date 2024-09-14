import { Pack, Template } from "@/app/types/template";
import { TemplateParser } from "@/utils/templateParser";

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

  async mergeMultipleContents(
    transcript: string,
    templates: Template[]
  ): Promise<{ mergedContent: string; suggestedTitle: string }[]> {
    try {
      const response = await this.callAPI<{
        mergedResults: { mergedContent: string; suggestedTitle: string }[];
      }>("mergeMultipleContents", { transcript, templates });

      return response.mergedResults;
    } catch (error) {
      console.error("Error in mergeMultipleContents:", error);

      if (error instanceof Error) {
        const errorMessage = error.message;
        if (errorMessage.includes("Failed to parse merge response")) {
          const partialResults = this.parsePartialResults(errorMessage);
          if (partialResults.length > 0) {
            console.log("Returning partial results:", partialResults);
            return partialResults;
          }
        }
      }

      // If no partial results could be parsed or it's a different error, return an empty array
      console.warn(
        "Returning empty array due to error in mergeMultipleContents"
      );
      return [];
    }
  }

  private parsePartialResults(
    errorMessage: string
  ): { mergedContent: string; suggestedTitle: string }[] {
    const results: { mergedContent: string; suggestedTitle: string }[] = [];
    const jsonRegex = /{[^{}]*}/g;
    const matches = errorMessage.match(jsonRegex);

    if (matches) {
      for (const match of matches) {
        try {
          const result = JSON.parse(match);
          if (result.mergedContent && result.suggestedTitle) {
            results.push(result);
          }
        } catch (e) {
          console.error("Failed to parse partial result:", e);
        }
      }
    }

    return results;
  }

  async suggestTitle(transcript: string): Promise<string> {
    try {
      const response = await this.callAPI<{ suggestedTitle: string }>(
        "suggestTitle",
        {
          transcript,
          prompt: "Please suggest a compelling title for this transcript.",
        }
      );

      if (!response || !response.suggestedTitle) {
        throw new Error("Invalid response from suggestTitle API");
      }

      return response.suggestedTitle;
    } catch (error) {
      console.error("Error suggesting title:", error);
      throw new Error(`Failed to suggest title: ${(error as Error).message}`);
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
    localStorage.removeItem("mergedContents");
    localStorage.removeItem("selectedTemplates");
    localStorage.removeItem("suggestedTags");
    // Add any other items that need to be cleared
  }

  async suggestTags(transcript: string): Promise<string[]> {
    try {
      const { suggestedTags } = await this.callAPI<{ suggestedTags: string[] }>(
        "suggestTags",
        {
          transcript,
          prompt:
            "Please suggest only single-word or short-phrase tags for this transcript. Do not include any explanations or sentences. Return the tags as a JSON array of strings.",
        }
      );
      return suggestedTags.filter(
        (tag) => !tag.includes(" ") || tag.startsWith("#")
      );
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
        const templateTags = (template.tags || []).map((tag: string) =>
          tag.toLowerCase()
        );
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
  ): Promise<Template[]> {
    try {
      const response = await this.callAPI<{
        bestTemplatesResponse: string;
      }>("chooseBestTemplate", { transcript, templates });

      console.log("API response:", response);

      // Parse the inner JSON string
      const parsedResponse = JSON.parse(response.bestTemplatesResponse);

      console.log("Parsed response:", parsedResponse);

      // Extract template IDs from the parsed response
      const templateIds = parsedResponse.templates || [];

      // Find the suggested templates from the list of templates
      const suggestedTemplates = templateIds
        .map((id: string) => templates.find((template) => template.id === id))
        .filter(Boolean) as Template[];

      console.log("Suggested templates:", suggestedTemplates);

      // Return the suggested templates (up to 8)
      return suggestedTemplates.slice(0, 8);
    } catch (error) {
      console.error("Error choosing best templates:", error);
      // Return an empty array in case of an error
      return [];
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

  saveMultipleMergedContents(title: string, mergedContents: string[]): void {
    const post = {
      title,
      contents: mergedContents,
      createdAt: new Date().toISOString(),
    };
    const savedPosts = this.getSavedPosts();
    savedPosts.push(post);
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }

  getSavedPosts(): any[] {
    const savedPosts = localStorage.getItem("savedPosts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  }
}

export const postService = new PostService();
