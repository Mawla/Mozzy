import { Pack, Template } from "@/app/types/template";
import { TemplateParser } from "@/utils/templateParser";
import { Post } from "@/app/types/post";
import { refinePodcastTranscriptPrompt } from "@/prompts/refinePodcastTranscript";
import * as AnthropicActions from "@/app/actions/anthropicActions";
import * as PostActions from "@/app/actions/posts";
import { ContentMetadata } from "@/app/types/contentMetadata";
import { ProcessingFormat } from "@/app/types/processing/base";
import { useLoadingStore } from "@/app/stores/loadingStore";
import { logger } from "@/lib/logger";

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

  async getPosts(): Promise<Post[]> {
    const response = await PostActions.getPosts();
    if (response.error) {
      logger.error("Error fetching posts", new Error(response.error));
      throw new Error(response.error);
    }
    return response.data || [];
  },

  async getPostById(id: string): Promise<Post | null> {
    const response = await PostActions.getPostById(id);
    if (response.error) {
      logger.error(`Error fetching post ${id}`, new Error(response.error));
      throw new Error(response.error);
    }
    return response.data || null;
  },

  async createNewPost(): Promise<Post> {
    const newPost = {
      title: "",
      content: "",
      tags: [],
      tweet_thread_content: [],
      transcript: "",
      merged_contents: {},
      template_ids: [],
      templates: [],
      status: "draft" as const,
    };

    const response = await PostActions.createPost(newPost);
    if (response.error) {
      logger.error("Error creating post", new Error(response.error));
      throw new Error(response.error);
    }
    return response.data!;
  },

  async handleSave(post: Post): Promise<Post> {
    try {
      logger.info("Handling save for post", { postId: post.id });
      const response = await PostActions.updatePost(post.id, post);

      if (response.error) {
        logger.error("Error saving post", new Error(response.error));
        throw new Error(response.error);
      }

      logger.info("Post saved successfully", { postId: post.id });
      return response.data!;
    } catch (error) {
      logger.error(
        "Error saving post",
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  },

  async deletePost(id: string): Promise<void> {
    const response = await PostActions.deletePost(id);
    if (response.error) {
      logger.error(`Error deleting post ${id}`, new Error(response.error));
      throw new Error(response.error);
    }
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
        format: "post" as ProcessingFormat,
        platform: "web",
        processedAt: new Date().toISOString(),
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
    merged_contents: { [templateId: string]: string };
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

    const merged_contents = mergeResponse.mergedResults.reduce(
      (acc, result) => {
        if (result.templateId && result.mergedContent !== null) {
          acc[result.templateId] = result.mergedContent;
        } else {
          console.error(`Missing template ID or merged content:`, result);
        }
        return acc;
      },
      {} as { [templateId: string]: string }
    );

    console.log("Processed merged_contents:", merged_contents);

    setLoading(true, 90, "Generating title...");
    let suggestedTitle;
    try {
      suggestedTitle = await this.suggestTitle(content);
    } catch (error) {
      console.error("Error suggesting title, using fallback:", error);
      suggestedTitle = this.generateFallbackTitle(content);
    }

    setLoading(false, 100, "Merge process completed");
    return { merged_contents, suggestedTitle };
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

  async bulkDeletePosts(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.deletePost(id);
    }
  },

  clearPostData(): void {
    console.warn("clearPostData is deprecated with Supabase storage");
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

  async handleMerge(postId: string): Promise<void> {
    const { setLoading } = useLoadingStore.getState();
    setLoading(true, 0, "Starting merge process...");

    try {
      const post = await this.getPostById(postId);
      if (!post) throw new Error("Post not found");

      const { merged_contents, suggestedTitle } =
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
            format: "post" as ProcessingFormat,
            platform: "web",
            processedAt: new Date().toISOString(),
          }
        );

      const updatedPost = {
        ...post,
        merged_contents,
        title: suggestedTitle,
        updated_at: new Date().toISOString(),
      };

      await this.handleSave(updatedPost);
      setLoading(false, 100, "Merge process completed");
    } catch (error) {
      console.error("Error handling merge:", error);
      setLoading(false, 0, "Merge process failed");
      throw error;
    }
  },

  async regenerateTemplateContent(postId: string): Promise<Post | null> {
    try {
      const post = await this.getPostById(postId);
      if (!post) throw new Error("Post not found");

      const { merged_contents, suggestedTitle } =
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
            format: "post" as ProcessingFormat,
            platform: "web",
            processedAt: new Date().toISOString(),
          }
        );

      const updatedPost = {
        ...post,
        merged_contents,
        title: suggestedTitle,
        updated_at: new Date().toISOString(),
      };

      return updatedPost;
    } catch (error) {
      console.error("Error regenerating template content:", error);
      return null;
    }
  },
};
