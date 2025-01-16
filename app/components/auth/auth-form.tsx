"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const router = useRouter();
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  if (!mounted) return null;

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
                brand: "black",
                brandAccent: "rgb(229, 231, 235)",
              },
            },
          },
          className: {
            container: "space-y-4",
            button: "w-full",
            divider: "my-4",
            label: "text-foreground",
            input: "bg-background",
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
          },
        }}
        providers={["google", "github"]}
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        showLinks={true}
        theme="dark"
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
