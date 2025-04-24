/**
 * Dynamically determines the correct base URL for the application.
 * Prioritizes NEXT_PUBLIC_SITE_URL (for production), then NEXT_PUBLIC_VERCEL_URL (for Vercel previews),
 * then VERCEL_URL (server-side Vercel URL), and falls back to localhost for development.
 * Ensures the URL starts with http(s):// and ends with a trailing slash.
 */
export const getURL = (): string => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel for client+server.
    process?.env?.VERCEL_URL ?? // Automatically set by Vercel server-side.
    "http://test.com:3000/";

  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;

  return url;
};
