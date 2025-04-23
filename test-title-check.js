// test-title-check.js - Testing that our fix to use a non-empty title works
const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");

async function testCreatePost() {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      "http://127.0.0.1:54321",
      "x", // Service role key for testing
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Generate a test user ID
    const userId = uuidv4();

    // Test with an empty title - should fail
    console.log("Testing with empty title (should fail):");
    try {
      const { data: emptyTitlePost, error: emptyTitleError } = await supabase
        .from("posts")
        .insert([
          {
            title: "",
            content: "Test content",
            user_id: userId,
            status: "draft",
          },
        ])
        .select();

      if (emptyTitleError) {
        console.log(
          "✅ Empty title correctly failed with error:",
          emptyTitleError.message
        );
      } else {
        console.log("❌ Empty title unexpectedly succeeded:", emptyTitlePost);
      }
    } catch (e) {
      console.log("✅ Empty title correctly failed with exception:", e.message);
    }

    // Test with a short title (< 3 chars) - should fail
    console.log("\nTesting with short title (should fail):");
    try {
      const { data: shortTitlePost, error: shortTitleError } = await supabase
        .from("posts")
        .insert([
          {
            title: "AB",
            content: "Test content",
            user_id: userId,
            status: "draft",
          },
        ])
        .select();

      if (shortTitleError) {
        console.log(
          "✅ Short title correctly failed with error:",
          shortTitleError.message
        );
      } else {
        console.log("❌ Short title unexpectedly succeeded:", shortTitlePost);
      }
    } catch (e) {
      console.log("✅ Short title correctly failed with exception:", e.message);
    }

    // Test with a valid title (>= 3 chars) - should succeed
    console.log("\nTesting with valid title (should succeed):");
    try {
      const { data: validTitlePost, error: validTitleError } = await supabase
        .from("posts")
        .insert([
          {
            title: "Untitled Post",
            content: "Test content",
            user_id: userId,
            status: "draft",
            tags: [],
            merged_contents: {},
            template_ids: [],
            templates: [],
            tweet_thread_content: [],
            transcript: "",
          },
        ])
        .select();

      if (validTitleError) {
        console.log(
          "❌ Valid title unexpectedly failed:",
          validTitleError.message
        );
      } else {
        console.log("✅ Valid title correctly succeeded:", validTitlePost);
      }
    } catch (e) {
      console.log(
        "❌ Valid title unexpectedly failed with exception:",
        e.message
      );
    }
  } catch (error) {
    console.error("Unexpected test error:", error);
  }
}

testCreatePost();
