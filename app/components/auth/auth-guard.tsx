"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { logger } from "@/lib/logger";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      logger.debug("User not authenticated, redirecting to login", {
        from: pathname,
      });
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requiredRole) {
      const userRoles = (user.app_metadata?.roles || []) as string[];
      if (!userRoles.includes(requiredRole)) {
        logger.warn("User lacks required role", {
          userId: user.id,
          requiredRole,
          userRoles,
        });
        router.push("/unauthorized");
      }
    }
  }, [user, isLoading, requiredRole, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          An error occurred while checking authentication status.
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated and has required role
  if (
    !user ||
    (requiredRole && !(user.app_metadata?.roles || []).includes(requiredRole))
  ) {
    return null;
  }

  return <>{children}</>;
}
