import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function AuthState() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <pre>{JSON.stringify({ session }, null, 2)}</pre>;
}
