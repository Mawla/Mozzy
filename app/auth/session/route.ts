import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      logger.error("Get session failed in route handler", error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!session) {
      logger.debug("No session found in route handler");
      return NextResponse.json({ session: null });
    }

    logger.debug("Session retrieved successfully in route handler", {
      userId: session.user.id,
    });
    return NextResponse.json({ session });
  } catch (error) {
    logger.error("Get session error in route handler", error as Error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      logger.error("Session validation failed", error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!session) {
      logger.warn("No session found during validation");
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // Check if session needs refresh
    const expiresAt = new Date(session.expires_at! * 1000);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (timeUntilExpiry < REFRESH_THRESHOLD) {
      logger.info("Session nearing expiry, attempting refresh");
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession();

      if (refreshError) {
        logger.error("Session refresh failed during validation", refreshError);
        return NextResponse.json(
          { error: refreshError.message },
          { status: 401 }
        );
      }

      if (!refreshData.session) {
        logger.warn("No session returned after refresh");
        return NextResponse.json(
          { error: "Session refresh failed" },
          { status: 401 }
        );
      }

      logger.info("Session refreshed during validation", {
        userId: refreshData.session.user.id,
      });
      return NextResponse.json({ session: refreshData.session });
    }

    logger.debug("Session validated successfully", { userId: session.user.id });
    return NextResponse.json({ session });
  } catch (error) {
    logger.error("Session validation error", error as Error);
    return NextResponse.json(
      { error: "Failed to validate session" },
      { status: 500 }
    );
  }
}
