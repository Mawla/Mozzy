import { NextResponse, type NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;

  // Create an empty response to start with
  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Public routes that don't need protection
  const publicRoutes = ["/auth", "/login", "/", "/api/auth"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    logger.debug("Public route accessed", { pathname });
    return response;
  }

  try {
    logger.debug("Checking auth for protected route", { pathname });
    const supabase = createMiddlewareClient(request, response);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Handle protected routes
    if (!session && !publicRoutes.some((route) => pathname.startsWith(route))) {
      logger.warn("Unauthorized access attempt", { pathname });
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (session) {
      logger.debug("Authenticated access", {
        pathname,
        userId: session.user.id,
      });
    }

    return response;
  } catch (error) {
    logger.error("Auth middleware error", error as Error, { pathname });
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("error", "auth_error");
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
