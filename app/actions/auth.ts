"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";
import { AuthError } from "@supabase/supabase-js";

export async function signIn(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error("Sign in failed", error);
      throw error;
    }

    logger.info("User signed in successfully", { userId: data.user.id });
    revalidatePath("/", "layout");
    return data;
  } catch (error) {
    logger.error("Sign in error", error as Error);
    throw error;
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error("Sign out failed", error);
      throw error;
    }

    logger.info("User signed out successfully");
    revalidatePath("/", "layout");
    redirect("/login");
  } catch (error) {
    logger.error("Sign out error", error as Error);
    throw error;
  }
}

export async function getUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      logger.error("Get user failed", error);
      return null;
    }

    if (!user) {
      logger.debug("No user found");
      return null;
    }

    logger.debug("User retrieved successfully", { userId: user.id });
    return user;
  } catch (error) {
    logger.error("Get user error", error as Error);
    return null;
  }
}

export async function getSession() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      logger.error("Get session failed", error);
      return null;
    }

    if (!session) {
      logger.debug("No session found");
      return null;
    }

    logger.debug("Session retrieved successfully", { userId: session.user.id });
    return session;
  } catch (error) {
    logger.error("Get session error", error as Error);
    return null;
  }
}

// Helper function to check if user has required role
export async function hasRole(role: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const userRoles = (user.app_metadata?.roles || []) as string[];
    return userRoles.includes(role);
  } catch (error) {
    logger.error("Role check failed", error as Error);
    return false;
  }
}
