import { createBrowserClient as createBrowserSupabaseClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

export function createBrowserClient() {
  return createBrowserSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
