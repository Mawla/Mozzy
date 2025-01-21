import { Card } from "@/components/ui/card";
import type {
  BaseTextChunk,
  ProcessingStatus,
  ProcessingChunk,
} from "@/app/types/processing/base";

interface ChunkingViewProps {
  chunks: ProcessingChunk[];
  isProcessing: boolean;
}

const getChunkStatus = (chunk: ProcessingChunk): string => {
  if (!chunk.status) return "Ready";

  switch (chunk.status) {
    case "processing":
      return "Processing...";
    case "completed":
      return "Completed";
    case "error":
      return "Error";
    default:
      return "Ready";
  }
};

const getChunkId = (chunk: ProcessingChunk): string => {
  if (typeof chunk.id === "number") {
    return `Chunk ${chunk.id + 1}`;
  }
  return `Chunk ${chunk.id}`;
};

export function ChunkingView({ chunks, isProcessing }: ChunkingViewProps) {
  if (!chunks || chunks.length === 0) {
    return (
      <div className="text-center text-gray-500">
        {isProcessing ? "Processing..." : "No chunks available"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chunks.map((chunk) => (
        <Card key={chunk.id} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{getChunkId(chunk)}</span>
            <span
              className={`text-sm ${
                chunk.status === "error" ? "text-red-600" : ""
              }`}
            >
              {getChunkStatus(chunk)}
            </span>
          </div>
          {chunk.text && (
            <pre className="text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">
              {chunk.text}
            </pre>
          )}
          {chunk.error && (
            <div className="text-sm text-red-600 mt-2">
              Error:{" "}
              {chunk.error instanceof Error
                ? chunk.error.message
                : String(chunk.error)}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
