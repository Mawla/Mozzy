import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface StepStatusIconProps {
  status: "idle" | "processing" | "completed" | "error";
}

export const StepStatusIcon = ({ status }: StepStatusIconProps) => {
  switch (status) {
    case "processing":
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};
