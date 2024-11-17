"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { ProcessingChunk } from "@/app/types/podcast/processing";
import { diff_match_patch, Diff } from "diff-match-patch";

interface ChunkVisualizerProps {
  chunks: ProcessingChunk[];
}

const dmp = new diff_match_patch();

const DiffView = ({
  original,
  modified,
}: {
  original: string;
  modified: string;
}) => {
  const diff = dmp.diff_main(original, modified);
  dmp.diff_cleanupSemantic(diff);

  return (
    <div className="font-mono text-sm whitespace-pre-wrap break-words">
      {diff.map((part: Diff, index: number) => {
        const [type, text] = part;
        let className = "";

        switch (type) {
          case 1: // Addition
            className = "bg-green-100 text-green-800 px-1 rounded";
            break;
          case -1: // Deletion
            className = "bg-red-100 text-red-800 px-1 rounded line-through";
            break;
          case 0: // No change
          default:
            className = "text-gray-700";
        }

        return (
          <span key={index} className={className}>
            {text}
          </span>
        );
      })}
    </div>
  );
};

export const ChunkVisualizer = ({ chunks }: ChunkVisualizerProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {chunks.map((chunk) => (
        <div
          key={chunk.id}
          className={`p-4 rounded-lg border ${getChunkStatusColor(
            chunk.status
          )}`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Chunk {chunk.id + 1}</span>
            <div className="flex items-center gap-2">
              {chunk.status === "processing" && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              )}
              <span className={`text-sm ${getStatusTextColor(chunk.status)}`}>
                {chunk.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Unified Diff View */}
            <div className="p-3 bg-white rounded border">
              {chunk.status === "processing" ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              ) : chunk.status === "completed" && chunk.response ? (
                <DiffView original={chunk.text} modified={chunk.response} />
              ) : chunk.status === "error" && chunk.error ? (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  Error: {chunk.error}
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">
                  Pending processing...
                </div>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(
                chunk.status
              )}`}
              style={{
                width: getProgressWidth(chunk.status),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const getChunkStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "border-green-200 bg-green-50/50";
    case "processing":
      return "border-blue-200 bg-blue-50/50";
    case "error":
      return "border-red-200 bg-red-50/50";
    default:
      return "border-gray-200";
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-600";
    case "processing":
      return "text-blue-600";
    case "error":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getProgressColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "processing":
      return "bg-blue-500";
    case "error":
      return "bg-red-500";
    default:
      return "bg-gray-200";
  }
};

const getProgressWidth = (status: string) => {
  switch (status) {
    case "completed":
      return "100%";
    case "processing":
      return "60%";
    case "error":
      return "100%";
    default:
      return "0%";
  }
};
