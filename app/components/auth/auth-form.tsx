"use client";

import { createBrowserClient } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { getURL } from "@/app/utils/url";

export function AuthForm() {
  console.log("AuthForm: Component rendering");
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams?.get("next") ?? "/dashboard";

  // Log component initialization
  useEffect(() => {
    logger.debug("AuthForm: Initializing with redirect parameters", {
      next_param: next,
      full_url: window.location.href,
    });
  }, [next]);

  const supabase = createBrowserClient();

  useEffect(() => {
    setMounted(true);
    console.log("AuthForm: Component mounted");
    logger.debug("AuthForm: Component mounted");
  }, []);

  // After mounted check or at end of first mounted useEffect we add a new useEffect for auth state change
  useEffect(() => {
    if (!mounted) return; // ensure component mounted

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        logger.info("AuthForm: Signed in, redirecting", { redirectTo: next });
        router.push(next);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [mounted, next, router, supabase]);

  if (!mounted) {
    return null;
  }

  // Construct the full redirect URL robustly using the URL constructor
  const callbackPath = `/auth/callback?next=${encodeURIComponent(next)}`;
  const redirectUrl = new URL(callbackPath, getURL()).toString();

  logger.debug("AuthForm: Setting up redirect URL", {
    redirectUrl,
    next_destination: next,
  });

  return (
    <div className="w-full max-w-[400px] mx-auto p-8">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      <Auth
        supabaseClient={supabase}
        view="sign_in"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "hsl(var(--primary))",
                brandAccent: "hsl(var(--primary))",
                inputBackground: "transparent",
                inputText: "hsl(var(--foreground))",
                inputPlaceholder: "hsl(var(--muted-foreground))",
                messageText: "hsl(var(--foreground))",
                messageTextDanger: "hsl(var(--destructive))",
                anchorTextColor: "hsl(var(--primary))",
                dividerBackground: "hsl(var(--border))",
                brandButtonText: "black",
              },
            },
          },
          className: {
            container: "space-y-4",
            label:
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            input:
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            button:
              "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-black !text-black hover:bg-primary/90 h-10 px-4 py-2 w-full",
            divider: "relative my-4",
            message: "text-sm text-muted-foreground",
            anchor:
              "text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline",
          },
        }}
        localization={{
          variables: {
            sign_in: {
              email_label: "Email",
              password_label: "Password",
              button_label: "Sign in",
              loading_button_label: "Signing in...",
              social_provider_text: "Sign in with {{provider}}",
            },
            sign_up: {
              email_label: "Email",
              password_label: "Create a password",
              button_label: "Create account",
              loading_button_label: "Creating account...",
              social_provider_text: "Sign up with {{provider}}",
            },
          },
        }}
        providers={["github", "google"]}
        redirectTo={redirectUrl}
        onlyThirdPartyProviders={false}
        magicLink={false}
        showLinks={true}
      />
    </div>
  );
}
