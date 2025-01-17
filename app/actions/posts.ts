"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/supabase";
import { logger } from "@/lib/logger";
import { Post } from "@/app/types/post";

export type ServerActionResponse<T> = {
  data?: T;
  error?: string;
};

export async function getPosts(): Promise<ServerActionResponse<Post[]>> {
  const supabase = createServerClient();

  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Failed to fetch posts", error);
      return { error: error.message };
    }

    return { data: posts };
  } catch (error) {
    logger.error("Unexpected error fetching posts", error);
    return { error: "An unexpected error occurred while fetching posts" };
  }
}

export async function getPostById(
  id: string
): Promise<ServerActionResponse<Post>> {
  const supabase = createServerClient();

  try {
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      logger.error(`Failed to fetch post ${id}`, error);
      return { error: error.message };
    }

    return { data: post };
  } catch (error) {
    logger.error(`Unexpected error fetching post ${id}`, error);
    return { error: "An unexpected error occurred while fetching the post" };
  }
}

export async function createPost(data: {
  title: string;
  content: string;
  metadata?: any;
  templates?: any[];
  mergedContents?: Record<string, string>;
  status?: "draft" | "published";
}): Promise<ServerActionResponse<Post>> {
  const supabase = createServerClient();

  try {
    const user = await supabase.auth.getUser();
    if (!user.data?.user) {
      return { error: "User not authenticated" };
    }

    const postData = {
      ...data,
      user_id: user.data.user.id,
      status: data.status || "draft",
      metadata: data.metadata || {},
      templates: data.templates || [],
      mergedContents: data.mergedContents || {},
    };

    const { data: post, error } = await supabase
      .from("posts")
      .insert([postData])
      .select()
      .single();

    if (error) {
      logger.error("Failed to create post", error, { postData });
      return { error: error.message };
    }

    revalidatePath("/dashboard/posts");
    return { data: post };
  } catch (error) {
    logger.error("Unexpected error creating post", error);
    return { error: "An unexpected error occurred while creating the post" };
  }
}

export async function updatePost(
  id: string,
  data: Partial<Post>
): Promise<ServerActionResponse<Post>> {
  const supabase = createServerClient();

  try {
    const user = await supabase.auth.getUser();
    if (!user.data?.user) {
      return { error: "User not authenticated" };
    }

    // Ensure the post belongs to the user
    const { data: existingPost } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existingPost) {
      return { error: "Post not found" };
    }

    if (existingPost.user_id !== user.data.user.id) {
      return { error: "Not authorized to update this post" };
    }

    const { data: updatedPost, error } = await supabase
      .from("posts")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error(`Failed to update post ${id}`, error, { data });
      return { error: error.message };
    }

    revalidatePath("/dashboard/posts");
    return { data: updatedPost };
  } catch (error) {
    logger.error(`Unexpected error updating post ${id}`, error);
    return { error: "An unexpected error occurred while updating the post" };
  }
}

export async function deletePost(
  id: string
): Promise<ServerActionResponse<void>> {
  const supabase = createServerClient();

  try {
    const user = await supabase.auth.getUser();
    if (!user.data?.user) {
      return { error: "User not authenticated" };
    }

    // Ensure the post belongs to the user
    const { data: existingPost } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existingPost) {
      return { error: "Post not found" };
    }

    if (existingPost.user_id !== user.data.user.id) {
      return { error: "Not authorized to delete this post" };
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      logger.error(`Failed to delete post ${id}`, error);
      return { error: error.message };
    }

    revalidatePath("/dashboard/posts");
    return {};
  } catch (error) {
    logger.error(`Unexpected error deleting post ${id}`, error);
    return { error: "An unexpected error occurred while deleting the post" };
  }
}
