import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      logger.error("Session refresh failed", error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.session) {
      logger.warn("No session found during refresh");
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    logger.info("Session refreshed successfully", {
      userId: data.session.user.id,
    });
    return NextResponse.json({ success: true, session: data.session });
  } catch (error) {
    logger.error("Session refresh error", error as Error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
