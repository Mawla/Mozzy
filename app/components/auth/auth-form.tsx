"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthForm() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<ReturnType<
    typeof createBrowserClient
  > | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        const logData = {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        };
        logger.error(
          "Missing Supabase environment variables",
          new Error("Missing configuration"),
          logData
        );
        setError("Missing Supabase configuration");
        return;
      }

      logger.debug("Initializing Supabase client", {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      });

      const client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      logger.debug("Supabase client created", {
        hasClient: !!client,
        hasAuth: !!client?.auth,
      });

      setSupabase(client);
      setMounted(true);

      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((event, session) => {
        logger.debug("Auth state changed", { event, userId: session?.user.id });
        if (event === "SIGNED_IN") {
          logger.info("User signed in successfully", {
            userId: session?.user.id,
          });
          router.push("/dashboard");
          router.refresh();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize auth";
      logger.error("Auth form initialization failed", err as Error, {
        error: errorMessage,
      });
      setError(errorMessage);
    }
  }, [router]);

  if (!mounted || !supabase) {
    return (
      <div className="w-full max-w-[400px] mx-auto p-4 mt-8 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[400px] mx-auto p-4 mt-8">
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          <p>Failed to load authentication: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px] mx-auto p-4 mt-8">
      <Auth
        supabaseClient={supabase}
        view="sign_in"
        appearance={{
          theme: ThemeSupa,
          extend: true,
          variables: {
            default: {
              colors: {
                brand: "rgb(var(--foreground))",
                brandAccent: "rgb(var(--muted))",
                inputBackground: "rgb(var(--background))",
                inputText: "rgb(var(--foreground))",
                inputPlaceholder: "rgb(var(--muted-foreground))",
              },
            },
          },
          className: {
            container: "space-y-4",
            button:
              "w-full bg-primary text-primary-foreground hover:bg-primary/90",
            divider: "my-4",
            label: "text-foreground",
            input: "bg-background border-input",
            message: "text-foreground",
            anchor: "text-primary hover:text-primary/80",
          },
        }}
        localization={{
          variables: {
            sign_in: {
              email_label: "Email address",
              password_label: "Password",
              button_label: "Sign in",
              loading_button_label: "Signing in ...",
            },
            sign_up: {
              email_label: "Email address",
              password_label: "Create a password",
              button_label: "Create account",
              loading_button_label: "Creating account ...",
            },
          },
        }}
        providers={["google", "github"]}
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        showLinks={true}
      />
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">Test credentials:</p>
          <p className="text-sm">Email: test@example.com</p>
          <p className="text-sm">Password: password123</p>
        </div>
      )}
    </div>
  );
}
