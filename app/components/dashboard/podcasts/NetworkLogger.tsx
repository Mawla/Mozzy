"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NetworkLog {
  timestamp: string;
  type: "request" | "response" | "error";
  message: string;
}

interface NetworkLoggerProps {
  logs: NetworkLog[];
  className?: string;
}

export const NetworkLogger = ({ logs, className = "" }: NetworkLoggerProps) => {
  const getLogColor = (type: string) => {
    switch (type) {
      case "request":
        return "text-blue-600";
      case "response":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="font-semibold mb-2">Network Activity</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="text-sm">
              <span className="text-gray-400">{log.timestamp}</span>{" "}
              <span className={getLogColor(log.type)}>{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
