import { Pack, Template } from "@/app/types/template";
import { TemplateParser } from "@/utils/templateParser";
import { Post } from "@/app/types/post";
import { refinePodcastTranscriptPrompt } from "@/prompts/refinePodcastTranscript";
import { create } from "zustand";
import * as AnthropicActions from "@/app/actions/anthropicActions";

// Define a store for loading state
interface LoadingState {
  isLoading: boolean;
  progress: number;
  message: string;
  setLoading: (isLoading: boolean, progress?: number, message?: string) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  progress: 0,
  message: "",
  setLoading: (isLoading, progress = 0, message = "") =>
    set({ isLoading, progress, message }),
}));

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
      console.log("Handling save for post:", post);
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

      console.log("Saving posts to localStorage:", posts);
      localStorage.setItem("posts", JSON.stringify(posts));
      console.log("Posts saved to localStorage");
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

  async suggestTags(transcript: string): Promise<string[]> {
    try {
      const suggestedTags = await AnthropicActions.suggestTags(transcript);
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

    if (normalizedTags.length === 0) {
      return templates.slice(0, 10); // Return all templates (up to 10) if no tags are provided
    }

    // {{ edit_start }}
    try {
      const templatesWithTags = templates.map((template) => ({
        id: template.id,
        tags: template.tags || [],
      }));

      const similarTemplateIds = await AnthropicActions.getSimilarTemplates(
        normalizedTags,
        templatesWithTags
      );

      const shortlistedTemplates = similarTemplateIds
        .map((id) => templates.find((template) => template.id === id))
        .filter((template): template is Template => template !== undefined);

      return shortlistedTemplates;
    } catch (error) {
      console.error("Error getting similar templates:", error);
      return [];
    }
    // {{ edit_end }}
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
    const mergeResponse = await this.mergeMultipleContents(content, templates);
    console.log("Merge response:", mergeResponse);

    const mergedContents = mergeResponse.mergedResults.reduce((acc, result) => {
      if (result.templateId && result.mergedContent) {
        acc[result.templateId] = result.mergedContent;
      } else {
        console.error(`Missing template ID or merged content:`, result);
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
      const result = await AnthropicActions.mergeContent(transcript, template);
      return result;
    } catch (error) {
      console.error("Error merging content:", error);
      throw error;
    }
  },

  async mergeMultipleContents(
    transcript: string,
    templates: Template[]
  ): Promise<{
    mergedResults: { templateId: string; mergedContent: string }[];
    partialSuccess: boolean;
    failedMergesCount: number;
  }> {
    try {
      const response = await AnthropicActions.mergeMultipleContents(
        transcript,
        templates
      );
      return response;
    } catch (error) {
      console.error("Error in mergeMultipleContents:", error);
      return {
        mergedResults: [],
        partialSuccess: true,
        failedMergesCount: templates.length,
      };
    }
  },

  async suggestTitle(transcript: string): Promise<string> {
    try {
      return await AnthropicActions.suggestTitle(transcript);
    } catch (error) {
      console.error("Error suggesting title:", error);
      return this.generateFallbackTitle(transcript);
    }
  },

  async chooseBestTemplate(
    transcript: string,
    templates: Template[]
  ): Promise<Template[]> {
    try {
      const bestTemplatesResponse = await AnthropicActions.chooseBestTemplate(
        transcript,
        templates
      );
      const parsedResponse = JSON.parse(bestTemplatesResponse);
      const templateIds = parsedResponse.templates || [];
      const suggestedTemplates = templateIds
        .map((id: string) => templates.find((template) => template.id === id))
        .filter(Boolean) as Template[];
      return suggestedTemplates.slice(0, 8);
    } catch (error) {
      console.error("Error choosing best templates:", error);
      return [];
    }
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

  async refinePodcastTranscript(
    transcript: string,
    additionalInstructions: string
  ): Promise<string> {
    try {
      useLoadingStore
        .getState()
        .setLoading(true, 0, "Preparing transcript for refinement...");

      const chunks = this.chunkText(transcript);
      const refinedChunks = await this.processChunks(
        chunks,
        additionalInstructions
      );

      useLoadingStore
        .getState()
        .setLoading(true, 90, "Combining refined chunks...");
      const combinedRefinedContent = refinedChunks.join("\n\n");

      if (chunks.length > 1) {
        useLoadingStore
          .getState()
          .setLoading(true, 95, "Performing final refinement...");
        const finalPrompt = refinePodcastTranscriptPrompt(
          combinedRefinedContent,
          additionalInstructions,
          1,
          1
        );

        const finalRefinedContent =
          await AnthropicActions.refinePodcastTranscript(finalPrompt);

        useLoadingStore.getState().setLoading(false);
        return finalRefinedContent;
      }

      useLoadingStore.getState().setLoading(false);
      return combinedRefinedContent;
    } catch (error) {
      useLoadingStore.getState().setLoading(false);
      console.error("Error refining podcast transcript:", error);
      throw error;
    }
  },

  async processChunks(
    chunks: string[],
    additionalInstructions: string
  ): Promise<string[]> {
    let refinedChunks: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1} of ${chunks.length}`);
      try {
        useLoadingStore
          .getState()
          .setLoading(
            true,
            (i / chunks.length) * 100,
            `Processing chunk ${i + 1} of ${chunks.length}`
          );

        const chunkPrompt = refinePodcastTranscriptPrompt(
          chunks[i],
          additionalInstructions,
          i + 1,
          chunks.length
        );

        console.log(`Sending API request for chunk ${i + 1}`);
        const refinedContent = await AnthropicActions.refinePodcastTranscript(
          chunkPrompt
        );

        console.log(`Received API response for chunk ${i + 1}`);

        refinedChunks.push(refinedContent);
        console.log(`Successfully processed chunk ${i + 1}`);
      } catch (error) {
        console.error(`Error processing chunk ${i + 1}:`, error);
        throw error;
      }
    }

    return refinedChunks;
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

  // {{ edit_start }}
  async handleMerge(postId: string): Promise<void> {
    try {
      const post = this.getPostById(postId);
      if (!post) throw new Error("Post not found");

      const { mergedContents, suggestedTitle } =
        await this.mergeContentsAndSuggestTitle(
          post.content,
          post.templates ?? [] // Ensure templates is always an array
        );

      const updatedPost = {
        ...post,
        mergedContents,
        title: suggestedTitle,
        updatedAt: new Date().toISOString(),
      };

      await this.handleSave(updatedPost);
    } catch (error) {
      console.error("Error handling merge:", error);
      throw error;
    }
  },
  // {{ edit_end }}
};
