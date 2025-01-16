"use client";

import { useEffect, useState } from "react";
import { logger } from "../../lib/logger";
import type { LogEntry, LogLevel } from "../../lib/logger";

interface LogsViewerProps {
  level?: LogLevel;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function LogsViewer({
  level,
  limit = 100,
  autoRefresh = true,
  refreshInterval = 5000,
}: LogsViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>(logger.getLogs(level, limit));

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLogs(logger.getLogs(level, limit));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, level, limit]);

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "debug":
        return "text-gray-500";
      case "info":
        return "text-blue-500";
      case "warn":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="bg-background rounded-lg border p-4">
      <div className="space-y-2">
        {logs.map((log: LogEntry, index: number) => (
          <div key={index} className="font-mono text-sm">
            <span className="text-gray-400">{log.timestamp}</span>{" "}
            <span className={getLevelColor(log.level)}>
              [{log.level.toUpperCase()}]
            </span>{" "}
            <span className="text-foreground">{log.message}</span>
            {log.data && (
              <pre className="mt-1 text-xs text-muted-foreground">
                {JSON.stringify(log.data, null, 2)}
              </pre>
            )}
            {log.error && (
              <pre className="mt-1 text-xs text-red-500">
                {log.error.stack || log.error.message}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
