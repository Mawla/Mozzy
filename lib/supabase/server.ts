import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";
import { logger } from "@/lib/logger";

export async function createClient(cookieStore = cookies()) {
  try {
    const client = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name);
            logger.debug("Cookie get", { name, exists: !!cookie });
            return cookie?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              if (cookieStore instanceof Response) {
                logger.warn("Cookie set attempted on Response object");
                return;
              }
              cookieStore.set({ name, value, ...options });
              logger.debug("Cookie set", { name });
            } catch (error) {
              // Only log warning if not in a Server Action
              if (!(error as Error).message.includes("Server Action")) {
                logger.warn(
                  "Cookie modification attempted in read-only context",
                  {
                    name,
                    error: error as Error,
                  }
                );
              }
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              if (cookieStore instanceof Response) {
                logger.warn("Cookie removal attempted on Response object");
                return;
              }
              cookieStore.delete({ name, ...options });
              logger.debug("Cookie removed", { name });
            } catch (error) {
              // Only log warning if not in a Server Action
              if (!(error as Error).message.includes("Server Action")) {
                logger.warn("Cookie deletion attempted in read-only context", {
                  name,
                  error: error as Error,
                });
              }
            }
          },
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        global: {
          headers: {
            "x-my-custom-header": "mozzy-app",
          },
        },
      }
    );

    logger.info("Supabase client created");
    return client;
  } catch (error) {
    logger.error("Failed to create Supabase client", error as Error);
    throw error;
  }
}

// Session management utilities
export async function getSessionOrThrow() {
  const client = await createClient();
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error || !session) {
    logger.error(
      "Failed to get session",
      error || new Error("No session found")
    );
    throw new Error("No active session");
  }

  return session;
}

export async function getUserOrThrow() {
  const session = await getSessionOrThrow();
  return session.user;
}
