import { Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import type { ProcessingStatus } from "@/app/types/podcast/processing";

interface StepStatusIconProps {
  status: ProcessingStatus;
}

export const StepStatusIcon = ({ status }: StepStatusIconProps) => {
  switch (status) {
    case "processing":
    case "pending":
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "error":
    case "failed":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "idle":
      return <Clock className="h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
};
