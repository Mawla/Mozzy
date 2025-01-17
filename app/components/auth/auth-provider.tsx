"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User, AuthChangeEvent } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  error: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient();

    // Initial session check
    async function checkSession() {
      try {
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          logger.debug("Session loaded", { userId: currentSession.user.id });
        }
      } catch (err) {
        logger.error("Failed to load session", err as Error);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        logger.debug("Auth state changed", {
          event,
          userId: currentSession?.user?.id,
        });

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          setSession(null);
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    // Check session on mount
    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Session refresh logic
  useEffect(() => {
    if (!session) return;

    const REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutes
    const refreshTimer = setInterval(async () => {
      try {
        const response = await fetch("/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to refresh session");
        }

        const { session: refreshedSession } = await response.json();
        if (refreshedSession) {
          setSession(refreshedSession);
          setUser(refreshedSession.user);
          logger.debug("Session refreshed", {
            userId: refreshedSession.user.id,
          });
        }
      } catch (err) {
        logger.error("Session refresh failed", err as Error);
        setError(err as Error);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(refreshTimer);
  }, [session]);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
