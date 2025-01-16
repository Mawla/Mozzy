"use client";

import { useEffect, useState } from "react";
import { logger } from "../lib/logger";

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize logger
      const init = async () => {
        try {
          await logger.setupBrowserLogging();
          logger.info("Browser logger initialized with console capture");
          setIsInitialized(true);
        } catch (err) {
          console.error("Failed to initialize logger:", err);
        }
      };
      init();
    }
  }, []);

  // Only render children once logger is initialized
  if (!isInitialized && typeof window !== "undefined") {
    return null; // Or a loading state if preferred
  }

  return <>{children}</>;
}
