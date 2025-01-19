"use client";

import { useEffect, useState } from "react";
import { ProcessingStatus } from "@/app/core/processing/types/base";
import { NetworkLogger } from "@/app/components/dashboard/podcasts/NetworkLogger";
import { ChunkVisualizer } from "@/app/components/dashboard/podcasts/ChunkVisualizer";
import { ProcessingState } from "@/app/types/podcast/processing";

interface ProcessingPipelineViewProps {
  state: ProcessingState;
  onRetry?: (stepId: string) => void;
}

export function ProcessingPipelineView({
  state,
  onRetry,
}: ProcessingPipelineViewProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleStep = (stepId: string) => {
    setExpanded((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  const getStepColor = (status: ProcessingStatus) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      case "processing":
        return "text-blue-500";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Processing Progress</h3>
          <span className="text-sm font-medium">
            {Math.round(state.overallProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${state.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {state.steps.map((step) => (
          <div
            key={step.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <button
              onClick={() => toggleStep(step.id)}
              className="w-full flex justify-between items-center"
            >
              <div className="flex items-center space-x-3">
                <span className={`${getStepColor(step.status)} text-lg`}>
                  {step.status === "completed"
                    ? "✓"
                    : step.status === "failed"
                    ? "✗"
                    : step.status === "processing"
                    ? "⟳"
                    : "○"}
                </span>
                <span className="font-medium">{step.name}</span>
              </div>
              <span className="text-sm text-gray-500">{step.progress}%</span>
            </button>

            {/* Expanded Content */}
            {expanded.includes(step.id) && (
              <div className="mt-4 pl-8">
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                {step.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-2">
                    <p className="text-sm text-red-700">{step.error.message}</p>
                    {onRetry && (
                      <button
                        onClick={() => onRetry(step.id)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Retry Step
                      </button>
                    )}
                  </div>
                )}
                {step.chunks && <ChunkVisualizer chunks={step.chunks} />}
                {step.networkLogs && <NetworkLogger logs={step.networkLogs} />}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Status */}
      <div
        className={`mt-6 p-4 rounded-lg ${
          state.status === "completed"
            ? "bg-green-50 text-green-700"
            : state.status === "failed"
            ? "bg-red-50 text-red-700"
            : state.status === "processing"
            ? "bg-blue-50 text-blue-700"
            : "bg-gray-50 text-gray-700"
        }`}
      >
        <p className="font-medium">
          Status: {state.status.charAt(0).toUpperCase() + state.status.slice(1)}
        </p>
        {state.error && (
          <p className="text-sm mt-2">Error: {state.error.message}</p>
        )}
      </div>
    </div>
  );
}
