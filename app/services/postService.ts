import { Pack, Template } from "@/app/types/template";
import { TemplateParser } from "@/utils/templateParser";
import { Post } from "@/app/types/post";
import { refinePodcastTranscriptPrompt } from "@/prompts/refinePodcastTranscript";
import * as AnthropicActions from "@/app/actions/anthropicActions";
import { ContentMetadata } from "@/app/types/contentMetadata";
import { useLoadingStore } from "@/app/stores/loadingStore";

// Define constants for magic numbers
const MAX_TOKENS = 1500;
const INITIAL_LOADING_PERCENTAGE = 0;
const FINAL_LOADING_PERCENTAGE = 100;
const CHUNK_PROCESSING_START_PERCENTAGE = 90;
const FINAL_REFINEMENT_START_PERCENTAGE = 95;

export const postService = {
  isCancelled: false,

  cancelOperation() {
    this.isCancelled = true;
  },

  resetCancellation() {
    this.isCancelled = false;
  },

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

  async suggestTags(transcript: string): Promise<ContentMetadata> {
    try {
      return await AnthropicActions.suggestTags(transcript);
    } catch (error) {
      console.error("Error suggesting tags:", error);
      return {
        categories: [],
        tags: [],
        topics: [],
        keyPeople: [],
        industries: [],
        contentType: [],
      };
    }
  },

  async shortlistTemplatesByTags(
    metadata: ContentMetadata,
    templates: Template[]
  ): Promise<Template[]> {
    try {
      const similarTemplateIds = await AnthropicActions.getSimilarTemplates(
        metadata,
        templates
      );

      const shortlistedTemplates = similarTemplateIds
        .map((id) => templates.find((template) => template.id === id))
        .filter((template): template is Template => template !== undefined);

      return shortlistedTemplates;
    } catch (error) {
      console.error("Error getting similar templates:", error);
      return [];
    }
  },

  async suggestTagsAndTemplates(
    content: string,
    allTemplates: Template[]
  ): Promise<{
    suggestedMetadata: ContentMetadata;
    suggestedTemplates: Template[];
  }> {
    const suggestedMetadata = await this.suggestTags(content);
    const shortlistedTemplates = await this.shortlistTemplatesByTags(
      suggestedMetadata,
      allTemplates
    );
    const suggestedTemplates = await this.chooseBestTemplate(
      content,
      suggestedMetadata,
      shortlistedTemplates
    );
    return { suggestedMetadata, suggestedTemplates };
  },

  async mergeContentsAndSuggestTitle(
    content: string,
    templates: Template[],
    metadata: ContentMetadata
  ): Promise<{
    mergedContents: { [templateId: string]: string };
    suggestedTitle: string;
  }> {
    const { setLoading } = useLoadingStore.getState();
    setLoading(true, 0, "Starting merge process...");

    const mergeResponse = await this.mergeMultipleContents(
      content,
      templates,
      metadata
    );
    console.log("Merge response:", mergeResponse);

    const mergedContents = mergeResponse.mergedResults.reduce((acc, result) => {
      if (result.templateId && result.mergedContent !== null) {
        acc[result.templateId] = result.mergedContent;
      } else {
        console.error(`Missing template ID or merged content:`, result);
      }
      return acc;
    }, {} as { [templateId: string]: string });

    console.log("Processed mergedContents:", mergedContents);

    setLoading(true, 90, "Generating title...");
    let suggestedTitle;
    try {
      suggestedTitle = await this.suggestTitle(content);
    } catch (error) {
      console.error("Error suggesting title, using fallback:", error);
      suggestedTitle = this.generateFallbackTitle(content);
    }

    setLoading(false, 100, "Merge process completed");
    return { mergedContents, suggestedTitle };
  },

  generateFallbackTitle(transcript: string): string {
    const words = transcript.split(" ").slice(0, 5);
    return words.join(" ") + "...";
  },

  async mergeContent(
    transcript: string,
    template: Template,
    metadata: ContentMetadata,
    additionalContext: string = ""
  ): Promise<string> {
    try {
      const contextPrompt = additionalContext
        ? `\nAdditional Context: ${additionalContext}\n`
        : "";

      const prompt = `
        Content: ${transcript}
        ${contextPrompt}
        Template: ${template.body}
        Metadata: ${JSON.stringify(metadata)}
        
        Please merge the content with the template, considering the metadata and any additional context provided.
      `;

      if (this.isCancelled) {
        throw new Error("Operation cancelled");
      }

      const result = await AnthropicActions.mergeContent(prompt);

      if (this.isCancelled) {
        throw new Error("Operation cancelled");
      }

      return result;
    } catch (error) {
      console.error("Error merging content:", error);
      throw error;
    }
  },

  async mergeMultipleContents(
    transcript: string,
    templates: Template[],
    metadata: ContentMetadata
  ): Promise<{
    mergedResults: { templateId: string; mergedContent: string | null }[];
    partialSuccess: boolean;
    failedMergesCount: number;
  }> {
    const { setLoading } = useLoadingStore.getState();
    const totalTemplates = templates.length;
    this.resetCancellation();

    try {
      const mergedResults = [];
      let failedMergesCount = 0;

      for (let i = 0; i < totalTemplates; i++) {
        if (this.isCancelled) {
          throw new Error("Operation cancelled");
        }

        const template = templates[i];
        setLoading(
          true,
          (i / totalTemplates) * 100,
          `Merging template ${i + 1} of ${totalTemplates}`
        );

        try {
          const mergedContent = await this.mergeContent(
            transcript,
            template,
            metadata
          );
          mergedResults.push({ templateId: template.id, mergedContent });
        } catch (error) {
          if (this.isCancelled) {
            throw error;
          }
          console.error(`Error merging content for template ${i + 1}:`, error);
          mergedResults.push({ templateId: template.id, mergedContent: null });
          failedMergesCount++;
        }
      }

      const partialSuccess =
        failedMergesCount > 0 && failedMergesCount < totalTemplates;

      return {
        mergedResults,
        partialSuccess,
        failedMergesCount,
      };
    } catch (error) {
      console.error("Error in mergeMultipleContents:", error);
      setLoading(false, 0, "Merge process failed");
      throw error;
    } finally {
      this.resetCancellation();
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
    metadata: ContentMetadata,
    templates: Template[]
  ): Promise<Template[]> {
    try {
      const bestTemplatesResponse = await AnthropicActions.chooseBestTemplate(
        transcript,
        metadata,
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
    this.resetCancellation();
    try {
      const { setLoading } = useLoadingStore.getState();
      setLoading(
        true,
        INITIAL_LOADING_PERCENTAGE,
        "Preparing transcript for refinement..."
      );

      if (this.isCancelled) {
        throw new Error("Operation cancelled");
      }

      const chunks = this.chunkText(transcript);
      const refinedChunks = await this.processChunks(
        chunks,
        additionalInstructions
      );

      if (this.isCancelled) {
        throw new Error("Operation cancelled");
      }

      setLoading(
        true,
        CHUNK_PROCESSING_START_PERCENTAGE,
        "Combining refined chunks..."
      );
      const combinedRefinedContent = refinedChunks.join("\n\n");

      if (chunks.length > 1) {
        if (this.isCancelled) {
          throw new Error("Operation cancelled");
        }

        setLoading(
          true,
          FINAL_REFINEMENT_START_PERCENTAGE,
          "Performing final refinement..."
        );
        const finalPrompt = refinePodcastTranscriptPrompt(
          combinedRefinedContent,
          additionalInstructions,
          1,
          1
        );

        const finalRefinedContent =
          await AnthropicActions.refinePodcastTranscript(finalPrompt);

        if (this.isCancelled) {
          throw new Error("Operation cancelled");
        }

        setLoading(false, FINAL_LOADING_PERCENTAGE, "Refinement complete");
        return finalRefinedContent;
      }

      setLoading(false, FINAL_LOADING_PERCENTAGE, "Refinement complete");
      return combinedRefinedContent;
    } catch (error) {
      const errorMessage =
        (error as Error).message === "Operation cancelled"
          ? "Refinement cancelled"
          : "Refinement failed";

      useLoadingStore
        .getState()
        .setLoading(false, INITIAL_LOADING_PERCENTAGE, errorMessage);

      console.error("Error refining podcast transcript:", error);
      throw error;
    } finally {
      this.resetCancellation();
    }
  },

  async processChunks(
    chunks: string[],
    additionalInstructions: string
  ): Promise<string[]> {
    let refinedChunks: string[] = [];
    const { setLoading } = useLoadingStore.getState();

    for (let i = 0; i < chunks.length; i++) {
      if (this.isCancelled) {
        throw new Error("Operation cancelled");
      }

      console.log(`Processing chunk ${i + 1} of ${chunks.length}`);
      try {
        setLoading(
          true,
          ((i + 1) / chunks.length) * 100,
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

        console.log(
          `Received API response for chunk ${i + 1}:`,
          refinedContent
        );

        refinedChunks.push(refinedContent);
        console.log(`Successfully processed chunk ${i + 1}`);
      } catch (error) {
        console.error(`Error processing chunk ${i + 1}:`, error);
        throw error;
      }
    }

    return refinedChunks;
  },

  chunkText(text: string, maxTokens: number = MAX_TOKENS): string[] {
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

  bulkDeletePosts(ids: string[]): void {
    let posts = this.getPosts();
    posts = posts.filter((post) => !ids.includes(post.id));
    localStorage.setItem("posts", JSON.stringify(posts));
  },

  async handleMerge(postId: string): Promise<void> {
    const { setLoading } = useLoadingStore.getState();
    setLoading(true, 0, "Starting merge process...");

    try {
      const post = this.getPostById(postId);
      if (!post) throw new Error("Post not found");

      const { mergedContents, suggestedTitle } =
        await this.mergeContentsAndSuggestTitle(
          post.content,
          post.templates ?? [],
          post.metadata ?? {
            categories: [],
            tags: [],
            topics: [],
            keyPeople: [],
            industries: [],
            contentType: [],
          }
        );

      const updatedPost = {
        ...post,
        mergedContents,
        title: suggestedTitle,
        updatedAt: new Date().toISOString(),
      };

      await this.handleSave(updatedPost);
      setLoading(false, 100, "Merge process completed");
    } catch (error) {
      console.error("Error handling merge:", error);
      setLoading(false, 0, "Merge process failed");
      throw error;
    }
  },
};
