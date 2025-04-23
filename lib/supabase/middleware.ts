import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { type RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import { type ResponseCookies } from "next/dist/server/web/spec-extension/cookies";
import { Database } from "@/types/supabase";
import { logger } from "@/lib/logger";

/**
 * Creates a Supabase client specifically for use within Next.js middleware.
 * It handles the read-only nature of request cookies and uses response
 * headers for setting/removing cookies.
 */
export function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  let requestCookies = { ...request.cookies } as RequestCookies;
  let responseCookies = { ...response.cookies } as ResponseCookies;

  try {
    const client = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = requestCookies.get(name);
            logger.debug("[Middleware] Cookie get", { name, exists: !!cookie });
            return cookie?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              logger.debug("[Middleware] Setting cookie via response", {
                name,
              });
              responseCookies.set({ name, value, ...options });
              requestCookies.set({ name, value, ...options });
            } catch (error) {
              logger.warn("[Middleware] Failed to set cookie", {
                name,
                error: error as Error,
              });
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              logger.debug("[Middleware] Removing cookie via response", {
                name,
              });
              responseCookies.delete({ name, ...options });
              requestCookies.delete(name);
              logger.debug(
                "[Middleware] Updated local request cookies state after remove",
                { name }
              );
            } catch (error) {
              logger.warn("[Middleware] Failed to remove cookie", {
                name,
                error: error as Error,
              });
            }
          },
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );

    logger.info("Supabase client created (middleware helper)");
    return client;
  } catch (error) {
    logger.error(
      "[Middleware] Failed to create Supabase client",
      error as Error
    );
    throw error;
  }
}
