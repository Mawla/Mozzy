"use client";

import { useState, useEffect } from "react";
import { logger } from "@/lib/logger";
import type { LogEntry, LogLevel } from "@/app/types/logging";

interface LogsViewerProps {
  level?: LogLevel;
  limit?: number;
}

export function LogsViewer({ level = "info", limit = 100 }: LogsViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Initial load
    const allLogs = logger.getLogs();
    const filteredLogs = level
      ? allLogs.filter((log) => log.level === level)
      : allLogs;
    setLogs(filteredLogs.slice(0, limit));

    // Set up interval to refresh logs
    const interval = setInterval(() => {
      const allLogs = logger.getLogs();
      const filteredLogs = level
        ? allLogs.filter((log) => log.level === level)
        : allLogs;
      setLogs(filteredLogs.slice(0, limit));
    }, 1000);

    return () => clearInterval(interval);
  }, [level, limit]);

  return (
    <div className="space-y-2">
      {logs.map((log, index) => (
        <div
          key={index}
          className={`p-2 rounded ${
            log.level === "error"
              ? "bg-red-100"
              : log.level === "warn"
              ? "bg-yellow-100"
              : "bg-gray-100"
          }`}
        >
          <div className="flex justify-between text-sm">
            <span className="font-mono">{log.timestamp}</span>
            <span
              className={`uppercase font-bold ${
                log.level === "error"
                  ? "text-red-700"
                  : log.level === "warn"
                  ? "text-yellow-700"
                  : "text-gray-700"
              }`}
            >
              {log.level}
            </span>
          </div>
          <p className="mt-1">{log.message}</p>
          {log.error && (
            <pre className="mt-1 text-sm text-red-600 overflow-x-auto">
              {log.error.message}
              {log.error.stack && (
                <code className="block mt-1 text-xs">{log.error.stack}</code>
              )}
            </pre>
          )}
          {log.data && (
            <pre className="mt-1 text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(log.data, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
