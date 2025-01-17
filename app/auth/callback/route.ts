import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    logger.error("Auth callback: No code provided");
    return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
  }

  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const {
      error,
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logger.error("Auth callback: Failed to exchange code for session", error);
      return NextResponse.redirect(
        new URL("/auth/auth-code-error", request.url)
      );
    }

    if (session) {
      logger.info("Auth callback: Successfully exchanged code for session", {
        userId: session.user.id,
      });
    }

    const redirectUrl = new URL(next, origin);
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    logger.error("Auth callback: Unexpected error", err as Error);
    return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
  }
}
