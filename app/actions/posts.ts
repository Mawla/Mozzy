"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/supabase";

export async function getPosts() {
  const supabase = createServerClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return posts;
}

export async function createPost(data: {
  title: string;
  content: string;
  user_id: string;
}) {
  const supabase = createServerClient();

  const { error } = await supabase.from("posts").insert([data]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/posts");
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    status?: "draft" | "published";
  }
) {
  const supabase = createServerClient();

  const { error } = await supabase.from("posts").update(data).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/posts");
}

export async function deletePost(id: string) {
  const supabase = createServerClient();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/posts");
}
