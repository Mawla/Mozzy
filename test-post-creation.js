// test-post-creation.js
const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");

async function testPostCreation() {
  try {
    // Initialize Supabase client
    const supabase = createClient("http://127.0.0.1:54321", "x", {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Sign in (if your RLS is set up to require authentication)
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

    if (authError) {
      console.error("Authentication error:", authError);
      return;
    }

    console.log("Authentication successful:", authData);

    // Generate a proper UUID for template_ids
    const templateId = uuidv4();

    // Create a test post with the correct field names
    const postData = {
      title: "Test Post",
      content: "This is a test post content",
      tags: ["test", "debug"],
      tweet_thread_content: ["Tweet 1", "Tweet 2"],
      transcript: "Test transcript",
      merged_contents: { [templateId]: "Merged content 1" },
      template_ids: [templateId],
      templates: [{ id: templateId, title: "Test Template" }],
      status: "draft",
      user_id: authData.user.id,
      metadata: {
        categories: [],
        tags: [],
        topics: [],
        keyPeople: [],
        industries: [],
        contentType: [],
      },
      refinement_instructions: "Test refinement",
      merge_instructions: "Test merge",
    };

    // Insert the post
    const { data: post, error } = await supabase
      .from("posts")
      .insert([postData])
      .select();

    if (error) {
      console.error("Error creating post:", error);
      return;
    }

    console.log("Post created successfully:", post);

    // Now try to fetch the post to verify
    const { data: fetchedPost, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", post[0].id)
      .single();

    if (fetchError) {
      console.error("Error fetching post:", fetchError);
      return;
    }

    console.log("Post fetched successfully:", fetchedPost);
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

testPostCreation();
