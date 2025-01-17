import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error("Sign out failed in route handler", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logger.info("User signed out successfully in route handler");
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Sign out error in route handler", error as Error);
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}
