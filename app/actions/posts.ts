"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import { Post } from "@/app/types/post";
import { PostgrestError } from "@supabase/supabase-js";

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
      const errorMessage =
        (error as PostgrestError).message || "Failed to fetch posts";
      logger.error("Failed to fetch posts", new Error(errorMessage));
      return { error: errorMessage };
    }

    return { data: posts };
  } catch (error) {
    logger.error(
      "Unexpected error fetching posts",
      error instanceof Error ? error : new Error(String(error))
    );
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
      const errorMessage =
        (error as PostgrestError).message || `Failed to fetch post ${id}`;
      logger.error(`Failed to fetch post ${id}`, new Error(errorMessage));
      return { error: errorMessage };
    }

    return { data: post };
  } catch (error) {
    logger.error(
      "Unexpected error fetching post",
      error instanceof Error ? error : new Error(String(error))
    );
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
      const errorMessage =
        (error as PostgrestError).message || "Failed to create post";
      logger.error("Failed to create post", new Error(errorMessage), {
        postData,
      });
      return { error: errorMessage };
    }

    revalidatePath("/dashboard/posts");
    return { data: post };
  } catch (error) {
    logger.error(
      "Unexpected error creating post",
      error instanceof Error ? error : new Error(String(error))
    );
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
      const errorMessage =
        (error as PostgrestError).message || `Failed to update post ${id}`;
      logger.error(`Failed to update post ${id}`, new Error(errorMessage), {
        data,
      });
      return { error: errorMessage };
    }

    revalidatePath("/dashboard/posts");
    return { data: updatedPost };
  } catch (error) {
    logger.error(
      "Unexpected error updating post",
      error instanceof Error ? error : new Error(String(error))
    );
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
      const errorMessage =
        (error as PostgrestError).message || `Failed to delete post ${id}`;
      logger.error(`Failed to delete post ${id}`, new Error(errorMessage));
      return { error: errorMessage };
    }

    revalidatePath("/dashboard/posts");
    return {};
  } catch (error) {
    logger.error(
      "Unexpected error deleting post",
      error instanceof Error ? error : new Error(String(error))
    );
    return { error: "An unexpected error occurred while deleting the post" };
  }
}
