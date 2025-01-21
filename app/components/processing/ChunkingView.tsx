import { Card } from "@/components/ui/card";
import type { ProcessingChunk } from "@/app/types/podcast/processing";

interface ChunkingViewProps {
  chunks: ProcessingChunk[];
  isProcessing: boolean;
}

export function ChunkingView({ chunks, isProcessing }: ChunkingViewProps) {
  return (
    <div className="space-y-4">
      {chunks.map((chunk) => (
        <Card key={chunk.id} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">
              Chunk {typeof chunk.id === "number" ? chunk.id + 1 : chunk.id}
            </span>
            <span className="text-sm">
              {chunk.status === "processing"
                ? "Processing..."
                : chunk.status === "completed"
                ? "Completed"
                : "Ready"}
            </span>
          </div>
          <pre className="text-sm bg-gray-50 p-2 rounded">{chunk.text}</pre>
        </Card>
      ))}
    </div>
  );
}
