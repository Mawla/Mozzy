import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;

  // Public routes that don't need protection
  const publicRoutes = ["/auth", "/login", "/", "/api/auth"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Admin routes require additional checks
  const isAdminRoute = pathname.startsWith("/admin");

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            requestHeaders.append("Set-Cookie", `${name}=${value}`);
          },
          remove(name: string, options: CookieOptions) {
            requestHeaders.append("Set-Cookie", `${name}=`);
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Additional check for admin routes
    if (isAdminRoute) {
      // TODO: Add role check for admin access
      // const { data: { user } } = await supabase.auth.getUser();
      // if (!user?.app_metadata?.isAdmin) {
      //   return NextResponse.redirect(new URL("/", request.url));
      // }
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    // Admin routes
    "/admin/:path*",
    // Dashboard routes
    "/dashboard/:path*",
    // Settings routes
    "/settings/:path*",
    // Protected API routes
    "/api/debug/:path*",
    "/api/podcasts/:path*",
    "/api/templates/:path*",
    "/api/openai/:path*",
    "/api/anthropic/:path*",
    "/api/ideas/:path*",
    "/api/icp/:path*",
  ],
};
