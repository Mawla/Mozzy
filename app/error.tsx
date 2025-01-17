"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Next.js Global Error", error, {
      digest: error.digest,
      url: typeof window !== "undefined" ? window.location.href : "",
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-lg bg-destructive/15 text-destructive">
            <h2 className="text-xl font-semibold mb-4">
              Something went wrong!
            </h2>
            <p className="text-sm mb-6">
              {error.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => reset()}
              className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
