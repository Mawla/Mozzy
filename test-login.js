const { createClient } = require("@supabase/supabase-js");

// Test credentials from seed.sql
const email = "test@example.com";
const password = "password123";

// Use local Supabase instance credentials
const supabaseUrl = "http://localhost:54321";
const supabaseAnonKey = "";

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log("Attempting to sign in with test credentials...");
  console.log("Supabase URL:", supabaseUrl);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Authentication failed:", error.message);
      return;
    }

    console.log("Authentication successful!");
    console.log("User ID:", data.user.id);
    console.log("Session token exists:", !!data.session.access_token);
    console.log("Redirect would go to: /dashboard");
  } catch (err) {
    console.error("Error during authentication:", err.message);
  }
}

testLogin().catch((err) => console.error("Unexpected error:", err));
