import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const { createClient } = await import("@/lib/supabase/server");

  if (!code) {
    logger.error("Auth callback: No code provided");
    return NextResponse.redirect(new URL("/auth/auth-code-error", origin));
  }

  try {
    const supabase = await createClient();

    const {
      error,
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logger.error("Auth callback: Failed to exchange code for session", error);
      return NextResponse.redirect(new URL("/auth/auth-code-error", origin));
    }

    if (session) {
      logger.info("Auth callback: Successfully exchanged code for session", {
        userId: session.user.id,
      });

      // Create response with redirect
      const response = NextResponse.redirect(new URL(next, origin));

      return response;
    }

    logger.error("Auth callback: No session after code exchange");
    return NextResponse.redirect(new URL("/auth/auth-code-error", origin));
  } catch (err) {
    logger.error("Auth callback: Unexpected error", err as Error);
    return NextResponse.redirect(new URL("/auth/auth-code-error", origin));
  }
}
