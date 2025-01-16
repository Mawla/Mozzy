"use client";

import { useEffect } from "react";
import { logger } from "../lib/logger";

export function LogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    logger.setupBrowserErrorCapture();
  }, []);

  return <>{children}</>;
}
