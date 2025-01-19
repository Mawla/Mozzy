"use client";

import { ProcessingStatus as ProcessingStatusType } from "@/app/core/processing/types";

interface ProcessingStatusProps {
  status: ProcessingStatusType;
  className?: string;
}

export function ProcessingStatus({
  status,
  className = "",
}: ProcessingStatusProps) {
  const getStatusColor = (status: ProcessingStatusType) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <span className={`font-medium ${getStatusColor(status)} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
