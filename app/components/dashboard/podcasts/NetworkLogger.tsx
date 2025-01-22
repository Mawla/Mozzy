"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NetworkLog, NetworkLogData } from "@/app/types/processing/base";

interface NetworkLoggerProps {
  logs: NetworkLog[];
  className?: string;
}

const formatLogData = (data: NetworkLogData): string => {
  try {
    switch (true) {
      case !!data.request:
        return JSON.stringify(data.request, null, 2);
      case !!data.response:
        return JSON.stringify(data.response, null, 2);
      case !!data.error:
        return JSON.stringify(data.error, null, 2);
      case !!data.metadata:
        return JSON.stringify(data.metadata, null, 2);
      default:
        return JSON.stringify(data, null, 2);
    }
  } catch {
    return "Unable to format log data";
  }
};

export const NetworkLogger = ({
  logs = [],
  className = "",
}: NetworkLoggerProps) => {
  const getLogStyle = (type: NetworkLog["type"]) => {
    return cn("flex items-center gap-2 p-2 rounded-md", {
      "bg-blue-50 text-blue-700": type === "request",
      "bg-green-50 text-green-700": type === "response",
      "bg-red-50 text-red-700": type === "error",
    });
  };

  const getBadgeVariant = (
    type: NetworkLog["type"]
  ): "default" | "secondary" | "destructive" => {
    switch (type) {
      case "request":
        return "secondary";
      case "response":
        return "default";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No processing logs yet
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div
            key={`${log.timestamp}-${index}`}
            className={getLogStyle(log.type)}
          >
            <Badge
              variant={getBadgeVariant(log.type)}
              className="w-20 justify-center"
            >
              {log.type}
            </Badge>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{log.message}</span>
                <span className="text-xs text-muted-foreground">
                  {log.timestamp}
                </span>
              </div>
              {log.error && (
                <div className="mt-1 text-xs text-red-600">
                  {log.error.message}
                  {log.error.stack && (
                    <pre className="mt-1 whitespace-pre-wrap text-[10px] opacity-75">
                      {log.error.stack}
                    </pre>
                  )}
                </div>
              )}
              {log.data && (
                <pre className="mt-1 text-xs opacity-75 whitespace-pre-wrap">
                  {formatLogData(log.data)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
