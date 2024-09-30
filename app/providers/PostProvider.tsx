"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Post } from "@/app/types/post";
import { postService } from "@/app/services/postService";
import { Template } from "@/app/types/template";
import { useRouter } from "next/navigation";

interface PostContextType {
  post: Post | null;
  updatePost: (updates: Partial<Post>) => void;
  createNewPost: () => void;
  loadPost: (id: string) => void;
  handleSuggestTagsAndTemplates: () => Promise<void>;
  handleMerge: () => Promise<void>;
  handleSave: () => Promise<void>;
  wordCount: number;
  clearLocalStorage: () => void;
  handleRemoveTemplate: (index: number) => void;
  handleTemplateSelection: (selectedTemplate: Template) => void;
  handleShortlistTemplates: () => Promise<void>;
  posts: Post[];
  loadPosts: () => void;
  deletePost: (id: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  const updatePost = useCallback((updates: Partial<Post>) => {
    setPost((prevPost) => {
      if (!prevPost) return null;
      return { ...prevPost, ...updates };
    });
  }, []);

  const loadPost = useCallback((id: string) => {
    const loadedPost = postService.getPostById(id);
    if (loadedPost) {
      setPost(loadedPost);
      setWordCount(loadedPost.content.trim().split(/\s+/).length);
    }
  }, []);

  const createNewPost = useCallback(() => {
    const newPost = postService.createNewPost();
    setPost(newPost);
    setWordCount(0);
  }, []);

  const handleSave = async () => {
    if (!post) return;
    try {
      const savedPost = await postService.handleSave(post);
      updatePost(savedPost);
    } catch (error) {
      console.error("Error saving post:", error);
      // Add error handling here
    }
  };

  const deletePost = async (id: string) => {
    try {
      await postService.deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      setPost(null);
      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleSuggestTagsAndTemplates = async () => {
    if (!post) return;
    try {
      const allTemplates = postService
        .getPacks()
        .flatMap((pack) => pack.templates || []);
      const { suggestedTags, suggestedTemplates } =
        await postService.suggestTagsAndTemplates(post.content, allTemplates);
      updatePost({ tags: suggestedTags, templates: suggestedTemplates });
    } catch (error) {
      console.error("Error suggesting tags and templates:", error);
    }
  };

  const handleMerge = async () => {
    if (!post) return;
    try {
      const { mergedContents, suggestedTitle } =
        await postService.mergeContentsAndSuggestTitle(
          post.content,
          post.templates || []
        );
      updatePost({ mergedContents, title: post.title || suggestedTitle });
    } catch (error) {
      console.error("Error merging content:", error);
    }
  };

  const clearLocalStorage = useCallback(() => {
    postService.clearPostData();
    setPost(null);
    setWordCount(0);
  }, []);

  const handleRemoveTemplate = useCallback(
    (index: number) => {
      if (post) {
        const updatedTemplates = [...(post.templates || [])];
        updatedTemplates.splice(index, 1);
        updatePost({
          templates: updatedTemplates,
          templateIds: updatedTemplates.map((t) => t.id),
        });
      }
    },
    [post, updatePost]
  );

  const handleTemplateSelection = useCallback(
    (selectedTemplate: Template) => {
      if (post) {
        const updatedTemplates = [...(post.templates || []), selectedTemplate];
        updatePost({
          templates: updatedTemplates,
          templateIds: updatedTemplates.map((t) => t.id),
        });
      }
    },
    [post, updatePost]
  );

  const handleShortlistTemplates = useCallback(async () => {
    if (post) {
      const allTemplates = postService
        .getPacks()
        .flatMap((pack) => pack.templates);
      const shortlistedTemplates = await postService.shortlistTemplatesByTags(
        post.tags,
        allTemplates
      );
      updatePost({
        templates: shortlistedTemplates,
        templateIds: shortlistedTemplates.map((t) => t.id),
      });
    }
  }, [post, updatePost]);

  const loadPosts = useCallback(() => {
    const loadedPosts = postService.getPosts();
    setPosts(loadedPosts);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <PostContext.Provider
      value={{
        post,
        updatePost,
        createNewPost,
        loadPost,
        handleSuggestTagsAndTemplates,
        handleMerge,
        handleSave,
        wordCount,
        clearLocalStorage,
        handleRemoveTemplate,
        handleTemplateSelection,
        handleShortlistTemplates,
        posts,
        loadPosts,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
