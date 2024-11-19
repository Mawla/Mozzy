import { Card } from "@/components/ui/card";
import { TextChunk } from "@/app/core/processing";

interface ChunkingViewProps {
  chunks: TextChunk[];
  isProcessing: boolean;
}

export function ChunkingView({ chunks, isProcessing }: ChunkingViewProps) {
  return (
    <div className="space-y-4">
      {chunks.map((chunk) => (
        <Card key={chunk.id} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Chunk {chunk.id + 1}</span>
            <span className="text-sm">
              {isProcessing ? "Processing..." : "Ready"}
            </span>
          </div>
          <pre className="text-sm bg-gray-50 p-2 rounded">{chunk.text}</pre>
        </Card>
      ))}
    </div>
  );
}
