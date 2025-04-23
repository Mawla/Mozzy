import { create } from "zustand";
import { Post } from "@/app/types/post";
import { Template } from "@/app/types/template";
import { postService } from "@/app/services/postService";
import { ContentMetadata } from "@/app/types/contentMetadata";
import { ProcessingFormat } from "@/app/types/processing/base";

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  wordCount: number;
  isLoading: boolean;
  progress: number;
  loadingMessage: string;
  refinement_instructions: string;
  merge_instructions: string;
}

interface PostActions {
  loadPosts: () => Promise<void>;
  loadPost: (id: string) => Promise<void>;
  setCurrentPost: (post: Post | null) => void;
  updatePost: (updates: Partial<Post>) => void;
  createNewPost: () => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  generateMetadata: () => Promise<void>;
  suggestTemplates: () => Promise<void>;
  handleMerge: (
    postId: string,
    templateIndex: number,
    merge_instructions: string
  ) => Promise<void>;
  handleSave: () => Promise<void>;
  handleRemoveTemplate: (index: number) => void;
  handleTemplateSelection: (selectedTemplate: Template) => void;
  setLoading: (
    isLoading: boolean,
    progress?: number,
    loadingMessage?: string
  ) => void;
  setRefinementInstructions: (instructions: string) => void;
  setMergeInstructions: (instructions: string) => void;
}

export const usePostStore = create<PostState & PostActions>()((set, get) => ({
  // State
  posts: [],
  currentPost: null,
  wordCount: 0,
  isLoading: false,
  progress: 0,
  loadingMessage: "",
  refinement_instructions: "",
  merge_instructions: "",

  // Actions
  loadPosts: async () => {
    const loadedPosts = await postService.getPosts();
    const processedPosts = loadedPosts.map((post) => ({
      ...post,
      templates: post.templates || [],
      template_ids: post.template_ids || [],
      merged_contents: post.merged_contents || {},
    }));

    console.log("Loading all posts with templates:", processedPosts);
    set({ posts: processedPosts });
  },

  loadPost: async (id: string) => {
    const loadedPost = await postService.getPostById(id);
    if (loadedPost) {
      const fullPost = {
        ...loadedPost,
        templates: loadedPost.templates || [],
        template_ids: loadedPost.template_ids || [],
        merged_contents: loadedPost.merged_contents || {},
      };

      console.log("Loading post with templates:", fullPost);

      set({
        currentPost: fullPost,
        wordCount: fullPost.content.trim().split(/\s+/).length,
        refinement_instructions: fullPost.refinement_instructions || "",
        merge_instructions: fullPost.merge_instructions || "",
      });
    } else {
      console.error(`Post with id ${id} not found`);
    }
  },

  setCurrentPost: (post: Post | null) => {
    set({
      currentPost: post,
      wordCount: post ? post.content.trim().split(/\s+/).length : 0,
    });
  },

  updatePost: (updates: Partial<Post>) =>
    set((state) => ({
      currentPost: state.currentPost
        ? { ...state.currentPost, ...updates }
        : null,
    })),

  createNewPost: async () => {
    const newPost = await postService.createNewPost();
    if (newPost) {
      set((state) => ({
        posts: [...state.posts, newPost],
        currentPost: newPost,
        wordCount: 0,
        merge_instructions: "",
        refinement_instructions: "",
      }));
    } else {
      console.error("Failed to create new post");
    }
  },

  deletePost: async (id: string) => {
    try {
      await postService.deletePost(id);
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        currentPost: state.currentPost?.id === id ? null : state.currentPost,
        wordCount: state.currentPost?.id === id ? 0 : state.wordCount,
      }));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  generateMetadata: async () => {
    const { currentPost } = get();
    if (!currentPost) return;
    try {
      const metadata = await postService.suggestTags(currentPost.content);
      get().updatePost({ metadata });
    } catch (error) {
      console.error("Error generating metadata:", error);
    }
  },

  suggestTemplates: async () => {
    const { currentPost } = get();
    if (!currentPost) return;
    const allTemplates = postService
      .getPacks()
      .flatMap((pack) => pack.templates);
    const suggestedTemplates = await postService.shortlistTemplatesByTags(
      currentPost.metadata || {
        categories: [],
        tags: [],
        topics: [],
        keyPeople: [],
        industries: [],
        contentType: [],
        format: "post" as ProcessingFormat,
        platform: "web",
        processedAt: new Date().toISOString(),
      },
      allTemplates
    );
    get().updatePost({
      templates: suggestedTemplates,
      template_ids: suggestedTemplates.map((t) => t.id),
    });
  },

  handleMerge: async (
    postId: string,
    templateIndex: number,
    merge_instructions: string = ""
  ) => {
    try {
      const { posts, currentPost } = get();
      let post = posts.find((p) => p.id === postId);

      // Use currentPost if post not found in posts array
      if (!post) {
        if (currentPost && currentPost.id === postId) {
          post = currentPost;
        } else {
          throw new Error("Post not found");
        }
      }

      // Ensure templates array exists
      if (!post.templates || !Array.isArray(post.templates)) {
        throw new Error("No templates available for this post");
      }

      // Validate template index
      if (templateIndex < 0 || templateIndex >= post.templates.length) {
        throw new Error(
          `Invalid template index: ${templateIndex}. Available templates: ${post.templates.length}`
        );
      }

      const template = post.templates[templateIndex];
      if (!template || !template.id) {
        throw new Error(
          `Template at index ${templateIndex} is invalid or missing ID`
        );
      }

      console.log(`Merging template ${templateIndex}:`, template);

      // Merge content for the specific template
      const mergedContent = await postService.mergeContent(
        post.content,
        template,
        post.metadata || {
          categories: [],
          tags: [],
          topics: [],
          keyPeople: [],
          industries: [],
          contentType: [],
          format: "post" as ProcessingFormat,
          platform: "web",
          processedAt: new Date().toISOString(),
        },
        merge_instructions
      );

      // Update the post with the new merged content and merge context
      const updated_merged_contents = {
        ...post.merged_contents,
        [template.id]: mergedContent,
      };
      const updatedPost = {
        ...post,
        merged_contents: updated_merged_contents,
        merge_instructions,
      };

      // Save to Supabase and update local state
      const savedPost = await postService.handleSave(updatedPost);
      if (savedPost) {
        set((state) => ({
          posts: state.posts.map((p) => (p.id === postId ? savedPost : p)),
          currentPost:
            state.currentPost?.id === postId ? savedPost : state.currentPost,
        }));
      }

      console.log(`Successfully merged content for template ${templateIndex}`);
    } catch (error) {
      console.error("Error in handleMerge:", error);
      throw error;
    }
  },

  handleSave: async () => {
    const { currentPost } = get();
    if (!currentPost) return;
    try {
      console.log("Saving post:", currentPost);
      const savedPost = await postService.handleSave(currentPost);
      if (savedPost) {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === savedPost.id ? savedPost : p
          ),
          currentPost: savedPost,
        }));
      }
    } catch (error) {
      console.error("Error saving post:", error);
      throw error;
    }
  },

  handleRemoveTemplate: (index: number) => {
    const { currentPost } = get();
    if (!currentPost || !currentPost.templates) return;

    const updatedTemplates = [...currentPost.templates];
    const removedTemplate = updatedTemplates.splice(index, 1)[0];

    if (!removedTemplate) return;

    const updatedTemplateIds = currentPost.template_ids.filter(
      (id) => id !== removedTemplate.id
    );

    const { [removedTemplate.id]: removedContent, ...remainingContents } =
      currentPost.merged_contents;

    get().updatePost({
      templates: updatedTemplates,
      template_ids: updatedTemplateIds,
      merged_contents: remainingContents,
    });
  },

  handleTemplateSelection: (selectedTemplate: Template) => {
    const { currentPost } = get();
    if (!currentPost) return;

    const updatedTemplates = [...(currentPost.templates || [])];
    const updatedTemplateIds = [...(currentPost.template_ids || [])];

    // Check if template is already selected
    const existingIndex = updatedTemplates.findIndex(
      (t) => t.id === selectedTemplate.id
    );

    if (existingIndex === -1) {
      // Add template if not already selected
      updatedTemplates.push(selectedTemplate);
      updatedTemplateIds.push(selectedTemplate.id);
    }

    get().updatePost({
      templates: updatedTemplates,
      template_ids: updatedTemplateIds,
    });
  },

  setLoading: (isLoading: boolean, progress = 0, loadingMessage = "") =>
    set({ isLoading, progress, loadingMessage }),

  setRefinementInstructions: (instructions: string) =>
    set({ refinement_instructions: instructions }),

  setMergeInstructions: (instructions: string) =>
    set({ merge_instructions: instructions }),
}));
