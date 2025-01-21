"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NetworkLog } from "@/app/types/podcast/processing";

interface NetworkLoggerProps {
  logs: NetworkLog[];
  className?: string;
}

export const NetworkLogger = ({ logs, className = "" }: NetworkLoggerProps) => {
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

  if (logs.length === 0) {
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
          <div key={index} className={getLogStyle(log.type)}>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
