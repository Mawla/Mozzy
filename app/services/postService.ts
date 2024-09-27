import { Pack, Template } from "@/app/types/template";
import { TemplateParser } from "@/utils/templateParser";
import { Post } from "@/app/types/post";

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
        partialSuccess: boolean;
        failedMergesCount: number;
      }>("mergeMultipleContents", { transcript, templates });

      console.log("API response for mergeMultipleContents:", response);

      if (response.partialSuccess) {
        console.warn(
          `${response.failedMergesCount} merge(s) failed. Returning partial results.`
        );
      }

      return response.mergedResults;
    } catch (error) {
      console.error("Error in mergeMultipleContents:", error);
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
      // Provide a fallback title generation mechanism
      return this.generateFallbackTitle(transcript);
    }
  }

  private generateFallbackTitle(transcript: string): string {
    // Simple fallback: Use the first few words of the transcript as the title
    const words = transcript.split(" ").slice(0, 5);
    return words.join(" ") + "...";
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

  clearPostData(): void {
    localStorage.removeItem("post");
    localStorage.removeItem("transcript");
    localStorage.removeItem("template");
    localStorage.removeItem("content");
    localStorage.removeItem("merge");
    localStorage.removeItem("selectedTemplate");
    localStorage.removeItem("mergedContents");
    localStorage.removeItem("selectedTemplates");
    localStorage.removeItem("suggestedTags");
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

  saveMultipleMergedContents(
    title: string,
    mergedContents: { [templateId: string]: string },
    transcript: string,
    templateIds: string[],
    templates: Template[]
  ): void {
    const post: Post = {
      id: Date.now().toString(),
      title,
      content: transcript, // Keep the original transcript as content
      tags: [],
      tweetThreadContent: [],
      transcript,
      mergedContents,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      templateIds,
      templates,
    };
    const savedPosts = this.getSavedPosts();
    savedPosts.push(post);
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }

  getSavedPosts(): Post[] {
    const savedPosts = localStorage.getItem("savedPosts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  }

  handleSave = async (post: Post): Promise<Post> => {
    try {
      // Update or add the post to local storage
      const savedPosts = this.getSavedPosts();
      const existingPostIndex = savedPosts.findIndex((p) => p.id === post.id);

      if (existingPostIndex !== -1) {
        // Update existing post
        savedPosts[existingPostIndex] = {
          ...savedPosts[existingPostIndex],
          ...post,
        };
      } else {
        // Add new post
        savedPosts.push(post);
      }

      localStorage.setItem("savedPosts", JSON.stringify(savedPosts));

      // Update the post's updatedAt timestamp
      const updatedPost = {
        ...post,
        updatedAt: new Date().toISOString(),
      };

      return updatedPost;
    } catch (error) {
      console.error("Error saving post:", error);
      throw error;
    }
  };

  getPosts(): Post[] {
    const savedPosts = localStorage.getItem("savedPosts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  }

  getPostById(id: string): Post | null {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === id);
    if (post) {
      return post;
    }
    return null;
  }

  deletePost(id: string): void {
    const savedPosts = this.getSavedPosts();
    const updatedPosts = savedPosts.filter((p) => p.id !== id);
    localStorage.setItem("savedPosts", JSON.stringify(updatedPosts));
  }

  async suggestTagsAndTemplates(
    content: string,
    allTemplates: Template[]
  ): Promise<{
    suggestedTags: string[];
    suggestedTemplates: Template[];
  }> {
    const suggestedTags = await this.suggestTags(content);
    const shortlistedTemplates = await this.shortlistTemplatesByTags(
      suggestedTags,
      allTemplates
    );
    const suggestedTemplates = await this.chooseBestTemplate(
      content,
      shortlistedTemplates
    );
    return { suggestedTags, suggestedTemplates };
  }

  async mergeContentsAndSuggestTitle(
    content: string,
    templates: Template[]
  ): Promise<{
    mergedContents: { [templateId: string]: string };
    suggestedTitle: string;
  }> {
    const mergeResults = await this.mergeMultipleContents(content, templates);
    console.log("Merge results:", mergeResults);

    const mergedContents = mergeResults.reduce((acc, result, index) => {
      const templateId = templates[index]?.id;
      if (templateId) {
        acc[templateId] = result.mergedContent;
      } else {
        console.error(`Missing template ID for index ${index}:`, result);
      }
      return acc;
    }, {} as { [templateId: string]: string });

    console.log("Processed mergedContents:", mergedContents);

    let suggestedTitle;
    try {
      suggestedTitle = await this.suggestTitle(content);
    } catch (error) {
      console.error("Error suggesting title, using fallback:", error);
      suggestedTitle = this.generateFallbackTitle(content);
    }

    return { mergedContents, suggestedTitle };
  }

  handleSuggestTagsAndTemplates = async (
    post: Post | null,
    updatePost: (updates: Partial<Post>) => void
  ) => {
    if (!post) return;
    try {
      const allTemplates = this.getPacks().flatMap((pack) => pack.templates);
      const { suggestedTags, suggestedTemplates } =
        await this.suggestTagsAndTemplates(post.content, allTemplates);
      updatePost({ tags: suggestedTags, templates: suggestedTemplates });
    } catch (error) {
      console.error("Error suggesting tags and templates:", error);
    }
  };

  handleMerge = async (
    post: Post | null,
    updatePost: (updates: Partial<Post>) => void
  ) => {
    if (!post) return;
    try {
      const { mergedContents, suggestedTitle } =
        await this.mergeContentsAndSuggestTitle(
          post.content,
          post.templates || []
        );
      updatePost({ mergedContents, title: post.title || suggestedTitle });
    } catch (error) {
      console.error("Error merging content:", error);
    }
  };

  handleShortlistTemplates = async (
    post: Post | null,
    updatePost: (updates: Partial<Post>) => void
  ) => {
    if (!post) return;
    try {
      const allTemplates = this.getPacks().flatMap((pack) => pack.templates);
      const shortlistedTemplates = await this.shortlistTemplatesByTags(
        post.tags,
        allTemplates
      );
      updatePost({
        templates: shortlistedTemplates,
        templateIds: shortlistedTemplates.map((t) => t.id),
      });
    } catch (error) {
      console.error("Error shortlisting templates:", error);
    }
  };

  clearLocalStorage = () => {
    localStorage.removeItem("post");
    localStorage.removeItem("transcript");
    localStorage.removeItem("template");
    localStorage.removeItem("content");
    localStorage.removeItem("merge");
    localStorage.removeItem("selectedTemplate");
    localStorage.removeItem("mergedContents");
    localStorage.removeItem("selectedTemplates");
    localStorage.removeItem("suggestedTags");
  };

  savePostToLocalStorage(post: Post): void {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === post.id);
    if (index !== -1) {
      posts[index] = post;
    } else {
      posts.push(post);
    }
    localStorage.setItem("posts", JSON.stringify(posts));
  }

  getPostFromLocalStorage(id: string): Post | null {
    const posts = this.getPosts();
    return posts.find((p) => p.id === id) || null;
  }

  createNewPost(): Post {
    const newPost: Post = {
      id: Date.now().toString(),
      title: "",
      content: "",
      tags: [],
      tweetThreadContent: [],
      transcript: "",
      mergedContents: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      templateIds: [],
      templates: [],
    };
    // Instead of modifying existing posts, we'll add this new post to the list
    const existingPosts = this.getPosts();
    existingPosts.push(newPost);
    localStorage.setItem("savedPosts", JSON.stringify(existingPosts));
    return newPost;
  }

  async refinePodcastTranscript(transcript: string): Promise<string> {
    try {
      const response = await this.callAPI<{ refinedContent: string }>(
        "refinePodcastTranscript",
        {
          transcript,
        }
      );

      if (!response.refinedContent) {
        throw new Error("Invalid response from refinePodcastTranscript API");
      }

      return response.refinedContent;
    } catch (error) {
      console.error("Error refining podcast transcript:", error);
      throw error;
    }
  }
}

export const postService = new PostService();
