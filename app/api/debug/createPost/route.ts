import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    // Create a Supabase client with admin privileges for testing
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // Create a test user ID
    const userId = uuidv4();

    // Create a post with a title that satisfies the title_length constraint
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title: "Test Post Title",
          content: "This is a test post content",
          user_id: userId,
          status: "draft",
          metadata: {},
          templates: [],
          merged_contents: {},
          tags: [],
          template_ids: [],
          tweet_thread_content: [],
          transcript: "",
        },
      ])
      .select();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
