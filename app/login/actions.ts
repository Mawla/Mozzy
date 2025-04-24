"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { headers } from "next/headers";
import { getURL } from "@/app/utils/url";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Get the next parameter if present
  const next = (formData.get("next") as string) || "/dashboard";

  try {
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      logger.error("Login failed", error, { email: data.email });
      redirect("/auth/auth-code-error");
    }

    logger.info("Login successful", { email: data.email, redirectTo: next });
    revalidatePath("/", "layout");
    redirect(next);
  } catch (err) {
    logger.error("Unexpected login error", err as Error, { email: data.email });
    redirect("/auth/auth-code-error");
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Use getURL for the email confirmation redirect
  const siteUrl = getURL();

  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      // Ensure path starts correctly relative to the base URL
      emailRedirectTo: `${siteUrl}auth/confirm`,
    },
  });

  if (error) {
    logger.error("Signup failed", error, { email: data.email });
    redirect("/auth/auth-code-error");
  }

  logger.info("Signup successful, pending confirmation", { email: data.email });
  revalidatePath("/", "layout");
  redirect("/auth/check-email");
}
