"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import { Post } from "@/app/types/post";
import { PostgrestError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export type ServerActionResponse<T> = {
  data?: T;
  error?: string;
};

export async function getPosts(): Promise<ServerActionResponse<Post[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "User not authenticated" };
    }

    // First get user's own posts
    const { data: userPosts, error: userPostsError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (userPostsError) {
      logger.error("Failed to fetch user posts", userPostsError);
      return { error: "Failed to fetch user posts" };
    }

    // Then get team IDs the user is a member of
    const { data: teamMemberships, error: teamError } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id);

    if (teamError) {
      logger.error("Failed to fetch team memberships", teamError);
      return { data: userPosts }; // Return just user posts if team fetch fails
    }

    if (!teamMemberships?.length) {
      return { data: userPosts }; // Return just user posts if no team memberships
    }

    // Get team posts
    const teamIds = teamMemberships.map((tm) => tm.team_id);
    const { data: teamPosts, error: teamPostsError } = await supabase
      .from("posts")
      .select("*")
      .in("team_id", teamIds)
      .order("created_at", { ascending: false });

    if (teamPostsError) {
      logger.error("Failed to fetch team posts", teamPostsError);
      return { data: userPosts }; // Return just user posts if team posts fetch fails
    }

    // Combine and sort all posts
    const allPosts = [...userPosts, ...teamPosts].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return { data: allPosts };
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
  try {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if (!user.data?.user) {
      return { error: "User not authenticated" };
    }

    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.data.user.id)
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
  template_ids?: string[];
  merged_contents?: Record<string, string>;
  status?: "draft" | "published";
}): Promise<ServerActionResponse<Post>> {
  try {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if (!user.data?.user) {
      return { error: "User not authenticated" };
    }

    // Clone the data to avoid modifying the original
    const postData = {
      ...data,
      user_id: user.data.user.id,
      status: data.status || "draft",
      metadata: data.metadata || {},
      templates: data.templates || [],
      template_ids: data.template_ids
        ? data.template_ids.map((id) => String(id))
        : [], // Ensure strings
      merged_contents: data.merged_contents || {},
    };

    // Log the template IDs we're using
    if (postData.template_ids && postData.template_ids.length > 0) {
      logger.info("Creating post with template_ids:", {
        template_ids: postData.template_ids,
      });
    }

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
  try {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if (!user.data?.user) {
      return { error: "User not authenticated" };
    }

    // Ensure the post belongs to the user
    const { data: existingPost } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", id)
      .eq("user_id", user.data.user.id)
      .single();

    if (!existingPost) {
      return { error: "Post not found" };
    }

    // Clone the data to avoid modifying the original
    const updateData = { ...data };

    // Ensure template_ids are stored as text strings
    // This is critical since the template IDs from the system are not valid UUIDs
    if (updateData.template_ids) {
      // Make sure we're working with an array of strings
      updateData.template_ids = updateData.template_ids.map((id) => String(id));

      logger.info(`Updating post ${id} with template_ids:`, {
        template_ids: updateData.template_ids,
      });
    }

    const { data: updatedPost, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      const errorMessage =
        (error as PostgrestError).message || `Failed to update post ${id}`;
      logger.error(`Failed to update post ${id}`, new Error(errorMessage), {
        data: updateData,
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
  try {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if (!user.data?.user) {
      return { error: "User not authenticated" };
    }

    // Ensure the post belongs to the user
    const { data: existingPost } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", id)
      .eq("user_id", user.data.user.id)
      .single();

    if (!existingPost) {
      return { error: "Post not found" };
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
