import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Log the callback request and redirect destination for debugging
  logger.debug("Auth callback received", {
    has_code: !!code,
    redirect_to: next,
    origin: origin,
    referrer: request.headers.get("referer"),
    request_url: request.url,
  });

  if (!code) {
    logger.error("Auth callback: No code provided");
    return NextResponse.redirect(new URL("/auth/auth-code-error", origin));
  }

  try {
    const supabase = await createClient();
    logger.debug("Auth callback: Exchanging code for session");

    const {
      error,
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logger.error(
        "Auth callback: Failed to exchange code for session",
        error,
        {
          code_length: code.length,
          error_status: error.status,
        }
      );
      return NextResponse.redirect(new URL("/auth/auth-code-error", origin));
    }

    if (session) {
      logger.info("Auth callback: Successfully exchanged code for session", {
        userId: session.user.id,
        redirecting_to: next,
        session_expires_at: session.expires_at
          ? new Date(session.expires_at * 1000).toISOString()
          : "unknown",
      });

      // Create response with redirect
      const redirectUrl = new URL(next, origin);
      const response = NextResponse.redirect(redirectUrl);

      // Log the redirect for debugging
      logger.debug("Auth callback redirecting", {
        destination: redirectUrl.toString(),
        user_id: session.user.id,
        headers: Object.fromEntries(response.headers.entries()),
      });

      return response;
    }

    logger.error("Auth callback: No session after code exchange");
    return NextResponse.redirect(new URL("/auth/auth-code-error", origin));
  } catch (err) {
    const error = err as Error;
    logger.error("Auth callback: Unexpected error", error, {
      error_name: error.name,
      error_message: error.message,
      stack: error.stack,
    });
    return NextResponse.redirect(new URL("/auth/auth-code-error", origin));
  }
}
