import { create } from "zustand";
import { Post } from "@/app/types/post";
import { Template } from "@/app/types/template";
import { postService } from "@/app/services/postService";
import { ContentMetadata } from "@/app/types/contentMetadata";

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  wordCount: number;
  isLoading: boolean;
  progress: number;
  loadingMessage: string;
}

interface PostActions {
  loadPosts: () => void;
  loadPost: (id: string) => void;
  setCurrentPost: (post: Post | null) => void;
  updatePost: (updates: Partial<Post>) => void;
  createNewPost: () => void;
  deletePost: (id: string) => Promise<void>;
  generateMetadata: () => Promise<void>;
  suggestTemplates: () => Promise<void>;
  handleMerge: (postId: string, templateIndex: number) => Promise<void>;
  handleSave: () => Promise<void>;
  handleRemoveTemplate: (index: number) => void;
  handleTemplateSelection: (selectedTemplate: Template) => void;
  clearLocalStorage: () => void;
  setLoading: (
    isLoading: boolean,
    progress?: number,
    loadingMessage?: string
  ) => void;
}

export const usePostStore = create<PostState & PostActions>()((set, get) => ({
  // State
  posts: [],
  currentPost: null,
  wordCount: 0,
  isLoading: false,
  progress: 0,
  loadingMessage: "",

  // Actions
  loadPosts: () => {
    const loadedPosts = postService.getPosts().map((post) => ({
      ...post,
      templates: post.templates || [],
      templateIds: post.templateIds || [],
      mergedContents: post.mergedContents || {},
    }));

    console.log("Loading all posts with templates:", loadedPosts);

    set({ posts: loadedPosts });
  },

  loadPost: (id: string) => {
    const loadedPost = postService.getPostById(id);
    if (loadedPost) {
      const fullPost = {
        ...loadedPost,
        templates: loadedPost.templates || [],
        templateIds: loadedPost.templateIds || [],
        mergedContents: loadedPost.mergedContents || {},
      };

      console.log("Loading post with templates:", fullPost);

      set({
        currentPost: fullPost,
        wordCount: fullPost.content.trim().split(/\s+/).length,
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

  createNewPost: () => {
    const newPost = postService.createNewPost();
    set((state) => ({
      posts: [...state.posts, newPost],
      currentPost: newPost,
      wordCount: 0,
    }));
  },

  deletePost: async (id: string) => {
    await postService.deletePost(id);
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
      currentPost: state.currentPost?.id === id ? null : state.currentPost,
      wordCount: state.currentPost?.id === id ? 0 : state.wordCount,
    }));
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
      },
      allTemplates
    );
    get().updatePost({
      templates: suggestedTemplates,
      templateIds: suggestedTemplates.map((t) => t.id),
    });
  },

  handleMerge: async (postId: string, templateIndex: number) => {
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
        }
      );

      // Update the post with the new merged content
      const updatedMergedContents = {
        ...post.mergedContents,
        [template.id]: mergedContent,
      };
      const updatedPost = { ...post, mergedContents: updatedMergedContents };

      // Update the posts array and currentPost
      set((state) => ({
        posts: state.posts.map((p) => (p.id === postId ? updatedPost : p)),
        currentPost:
          state.currentPost?.id === postId ? updatedPost : state.currentPost,
      }));

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
      console.log("Post saved. Returned post:", savedPost);
      get().updatePost(savedPost);
      console.log("Store updated after save. Current post:", get().currentPost);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  },

  handleRemoveTemplate: (index: number) => {
    set((state) => {
      if (!state.currentPost) return state;
      const updatedTemplates = [...(state.currentPost.templates || [])];
      updatedTemplates.splice(index, 1);
      return {
        currentPost: {
          ...state.currentPost,
          templates: updatedTemplates,
          templateIds: updatedTemplates.map((t) => t.id),
        },
      };
    });
  },

  handleTemplateSelection: (selectedTemplate: Template) => {
    set((state) => {
      if (!state.currentPost) return state;
      const updatedTemplates = [
        ...(state.currentPost.templates || []),
        selectedTemplate,
      ];
      return {
        currentPost: {
          ...state.currentPost,
          templates: updatedTemplates,
          templateIds: updatedTemplates.map((t) => t.id),
        },
      };
    });
  },

  clearLocalStorage: () => {
    postService.clearPostData();
    set({ currentPost: null, wordCount: 0 });
  },

  setLoading: (isLoading: boolean, progress = 0, loadingMessage = "") =>
    set({ isLoading, progress, loadingMessage }),
}));
