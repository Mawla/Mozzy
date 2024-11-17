import {
  ProcessingStatus,
  ProcessingChunk,
} from "@/app/types/podcast/processing";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export const getStepBadgeVariant = (status: ProcessingStatus): BadgeVariant => {
  const variants: Record<ProcessingStatus, BadgeVariant> = {
    completed: "default",
    error: "destructive",
    processing: "secondary",
    idle: "outline",
  };
  return variants[status];
};

export const isProcessingComplete = (chunks: ProcessingChunk[]): boolean => {
  return (
    chunks.length > 0 && chunks.every((chunk) => chunk.status === "completed")
  );
};

export const getProcessedContent = (chunks: ProcessingChunk[]): string => {
  return chunks
    .filter((chunk) => chunk.status === "completed")
    .map((chunk) => chunk.response)
    .filter(Boolean)
    .join(" ");
};
