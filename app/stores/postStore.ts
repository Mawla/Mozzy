import { create } from "zustand";
import { Post } from "@/app/types/post";
import { Template } from "@/app/types/template";
import { postService } from "@/app/services/postService";

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
  handleSuggestTagsAndTemplates: () => Promise<void>;
  handleMerge: (postId: string) => Promise<void>;
  handleSave: () => Promise<void>;
  handleRemoveTemplate: (index: number) => void;
  handleTemplateSelection: (selectedTemplate: Template) => void;
  handleShortlistTemplates: () => Promise<void>;
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
    const loadedPosts = postService.getPosts();
    set({ posts: loadedPosts });
  },

  loadPost: (id: string) => {
    const loadedPost = postService.getPostById(id);
    if (loadedPost) {
      set({
        currentPost: loadedPost,
        wordCount: loadedPost.content.trim().split(/\s+/).length,
      });
    }
  },

  setCurrentPost: (post: Post | null) => {
    set({
      currentPost: post,
      wordCount: post ? post.content.trim().split(/\s+/).length : 0,
    });
  },

  updatePost: (updates: Partial<Post>) => {
    set((state) => {
      const updatedPost = state.currentPost
        ? { ...state.currentPost, ...updates }
        : null;
      return {
        currentPost: updatedPost,
        posts: state.posts.map((p) =>
          p.id === updatedPost?.id ? updatedPost : p
        ),
        wordCount: updatedPost
          ? updatedPost.content.trim().split(/\s+/).length
          : state.wordCount,
      };
    });
  },

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

  handleSuggestTagsAndTemplates: async () => {
    const { currentPost } = get();
    if (!currentPost) return;
    try {
      const allTemplates = postService
        .getPacks()
        .flatMap((pack) => pack.templates || []);
      const { suggestedTags, suggestedTemplates } =
        await postService.suggestTagsAndTemplates(
          currentPost.content,
          allTemplates
        );
      get().updatePost({ tags: suggestedTags, templates: suggestedTemplates });
    } catch (error) {
      console.error("Error suggesting tags and templates:", error);
    }
  },

  handleMerge: async (postId: string) => {
    await postService.handleMerge(postId);
    const updatedPost = postService.getPostById(postId);
    set({ currentPost: updatedPost });
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

  handleShortlistTemplates: async () => {
    const { currentPost } = get();
    if (!currentPost) return;
    const allTemplates = postService
      .getPacks()
      .flatMap((pack) => pack.templates);
    const shortlistedTemplates = await postService.shortlistTemplatesByTags(
      currentPost.tags,
      allTemplates
    );
    get().updatePost({
      templates: shortlistedTemplates,
      templateIds: shortlistedTemplates.map((t) => t.id),
    });
  },

  clearLocalStorage: () => {
    postService.clearPostData();
    set({ currentPost: null, wordCount: 0 });
  },

  setLoading: (isLoading: boolean, progress = 0, loadingMessage = "") =>
    set({ isLoading, progress, loadingMessage }),
}));
