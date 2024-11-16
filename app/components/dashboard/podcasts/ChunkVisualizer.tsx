"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface ChunkVisualizerProps {
  chunks: {
    id: number;
    text: string;
    status: "pending" | "processing" | "completed" | "error";
    response?: string;
    error?: string;
  }[];
  networkLogs: {
    timestamp: string;
    type: "request" | "response" | "error";
    message: string;
  }[];
}

export const ChunkVisualizer = ({
  chunks,
  networkLogs,
}: ChunkVisualizerProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100";
      case "processing":
        return "bg-blue-100";
      case "completed":
        return "bg-green-100";
      case "error":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

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
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Chunks Processing</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {chunks.map((chunk) => (
              <div
                key={chunk.id}
                className={`p-3 rounded-md ${getStatusColor(chunk.status)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Chunk {chunk.id}</span>
                  {chunk.status === "processing" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {chunk.text}
                </p>
                {chunk.error && (
                  <p className="text-sm text-red-600 mt-1">{chunk.error}</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Network Activity</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {networkLogs.map((log, index) => (
              <div key={index} className="text-sm">
                <span className="text-gray-400">{log.timestamp}</span>{" "}
                <span className={getLogColor(log.type)}>{log.message}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
