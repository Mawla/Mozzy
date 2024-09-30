import { Pack, Template } from "@/app/types/template";
import { TemplateParser } from "@/utils/templateParser";
import { Post } from "@/app/types/post";
import { refinePodcastTranscriptPrompt } from "@/prompts/refinePodcastTranscript";

const callAPI = async <T>(action: string, data: any): Promise<T> => {
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
};

export const postService = {
  getPacks(): Pack[] {
    const parser = new TemplateParser();
    return parser.getPacks();
  },

  getPosts(): Post[] {
    const posts = localStorage.getItem("posts");
    return posts ? JSON.parse(posts) : [];
  },

  getPostById(id: string): Post | null {
    const posts = this.getPosts();
    return posts.find((p) => p.id === id) || null;
  },

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
    const posts = this.getPosts();
    posts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));
    return newPost;
  },

  async handleSave(post: Post): Promise<Post> {
    try {
      const posts = this.getPosts();
      const existingPostIndex = posts.findIndex((p) => p.id === post.id);

      if (existingPostIndex !== -1) {
        posts[existingPostIndex] = {
          ...posts[existingPostIndex],
          ...post,
          updatedAt: new Date().toISOString(),
        };
      } else {
        posts.push({
          ...post,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem("posts", JSON.stringify(posts));
      return post;
    } catch (error) {
      console.error("Error saving post:", error);
      throw error;
    }
  },

  async deletePost(id: string): Promise<void> {
    const posts = this.getPosts();
    const updatedPosts = posts.filter((post) => post.id !== id);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  },

  clearLocalStorage(): void {
    localStorage.removeItem("post");
    localStorage.removeItem("transcript");
    localStorage.removeItem("template");
    localStorage.removeItem("content");
    localStorage.removeItem("merge");
    localStorage.removeItem("selectedTemplate");
    localStorage.removeItem("mergedContents");
    localStorage.removeItem("selectedTemplates");
    localStorage.removeItem("suggestedTags");
  },

  async suggestTags(transcript: string): Promise<string[]> {
    try {
      const { suggestedTags } = await callAPI<{ suggestedTags: string[] }>(
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
  },

  async shortlistTemplatesByTags(
    tags: string[],
    templates: Template[]
  ): Promise<Template[]> {
    const normalizedTags = tags.map((tag) =>
      tag.replace("#", "").toLowerCase()
    );

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
      .slice(0, 10)
      .map((item) => item.template);

    return shortlistedTemplates.length > 0
      ? shortlistedTemplates
      : templates.slice(0, 10);
  },

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
  },

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
  },

  generateFallbackTitle(transcript: string): string {
    const words = transcript.split(" ").slice(0, 5);
    return words.join(" ") + "...";
  },

  async mergeContent(
    transcript: string,
    template: string
  ): Promise<{ mergedContent: string; suggestedTitle: string }> {
    try {
      const response = await callAPI<{
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
  },

  async mergeMultipleContents(
    transcript: string,
    templates: Template[]
  ): Promise<{ mergedContent: string; suggestedTitle: string }[]> {
    try {
      const response = await callAPI<{
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
  },

  async suggestTitle(transcript: string): Promise<string> {
    try {
      const response = await callAPI<{ suggestedTitle: string }>(
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
      return this.generateFallbackTitle(transcript);
    }
  },

  saveToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  },

  getFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  },

  saveTemplateToLocalStorage(template: Template): void {
    localStorage.setItem("selectedTemplate", JSON.stringify(template));
  },

  getTemplateFromLocalStorage(): Template | null {
    const savedTemplate = localStorage.getItem("selectedTemplate");
    return savedTemplate ? JSON.parse(savedTemplate) : null;
  },

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
  },

  async chooseBestTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<Template[]> {
    try {
      const response = await callAPI<{
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
  },

  saveSuggestedTagsToLocalStorage(tags: string[]): void {
    console.log("Saving tags to localStorage:", tags); // Debug log
    localStorage.setItem("suggestedTags", JSON.stringify(tags));
  },

  getSuggestedTagsFromLocalStorage(): string[] {
    const savedTags = localStorage.getItem("suggestedTags");
    return savedTags ? JSON.parse(savedTags) : [];
  },

  async postToLinkedIn(title: string, content: string): Promise<void> {
    try {
      const response = await callAPI<{ success: boolean }>("postToLinkedIn", {
        title,
        content,
      });
      if (!response.success) {
        throw new Error("Failed to post to LinkedIn");
      }
    } catch (error) {
      console.error("Error posting to LinkedIn:", error);
      throw error;
    }
  },

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
    const posts = this.getPosts();
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
  },

  savePostToLocalStorage(post: Post): void {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === post.id);
    if (index !== -1) {
      posts[index] = post;
    } else {
      posts.push(post);
    }
    localStorage.setItem("posts", JSON.stringify(posts));
  },

  getPostFromLocalStorage(id: string): Post | null {
    const posts = this.getPosts();
    return posts.find((p) => p.id === id) || null;
  },

  async refinePodcastTranscript(
    transcript: string,
    additionalInstructions: string
  ): Promise<string> {
    try {
      const chunks = this.chunkText(transcript);
      const refinedChunks = await this.processChunks(
        chunks,
        additionalInstructions
      );

      const combinedRefinedContent = refinedChunks.join("\n\n");

      if (chunks.length > 1) {
        const finalPrompt = refinePodcastTranscriptPrompt(
          combinedRefinedContent,
          additionalInstructions,
          1,
          1
        );

        const finalResponse = await callAPI<{ refinedContent: string }>(
          "refinePodcastTranscript",
          {
            prompt: finalPrompt,
          }
        );

        if (!finalResponse.refinedContent) {
          throw new Error(
            "Invalid response from final refinePodcastTranscript API call"
          );
        }

        return finalResponse.refinedContent;
      }

      return combinedRefinedContent;
    } catch (error) {
      console.error("Error refining podcast transcript:", error);
      throw error;
    }
  },

  bulkDeletePosts(ids: string[]): void {
    let posts = this.getPosts();
    posts = posts.filter((post) => !ids.includes(post.id));
    localStorage.setItem("posts", JSON.stringify(posts));
  },

  chunkText(text: string, maxTokens: number = 4000): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let currentChunk: string[] = [];

    for (const word of words) {
      if (currentChunk.length + 1 > maxTokens) {
        chunks.push(currentChunk.join(" "));
        currentChunk = [];
      }
      currentChunk.push(word);
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(" "));
    }

    return chunks;
  },

  async processChunks(
    chunks: string[],
    additionalInstructions: string
  ): Promise<string[]> {
    let refinedChunks: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1} of ${chunks.length}`);
      try {
        const chunkPrompt = refinePodcastTranscriptPrompt(
          chunks[i],
          additionalInstructions,
          i + 1,
          chunks.length
        );

        console.log(`Sending API request for chunk ${i + 1}`);
        const response = await callAPI<{ refinedContent: string }>(
          "refinePodcastTranscript",
          {
            prompt: chunkPrompt,
          }
        );

        console.log(`Received API response for chunk ${i + 1}`);

        if (!response.refinedContent) {
          throw new Error(
            `Invalid response from refinePodcastTranscript API for chunk ${
              i + 1
            }`
          );
        }

        refinedChunks.push(response.refinedContent);
        console.log(`Successfully processed chunk ${i + 1}`);
      } catch (error) {
        console.error(`Error processing chunk ${i + 1}:`, error);
        throw error;
      }
    }

    return refinedChunks;
  },
};
