"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { ProcessingStep } from "@/app/types/processing/base";
import { cn } from "@/lib/utils";

interface ParallelProcessingStatusProps {
  steps: ProcessingStep[];
  currentStep: string | null;
}

export const ParallelProcessingStatus = ({
  steps,
  currentStep,
}: ParallelProcessingStatusProps) => {
  const getStepProgress = (step: ProcessingStep) => {
    switch (step.status) {
      case "completed":
        return 100;
      case "processing":
        return step.name === currentStep ? 60 : 0;
      case "error":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Processing Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step) => (
          <div key={step.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{step.name}</span>
              <Badge
                variant={
                  step.status === "completed"
                    ? "default"
                    : step.status === "error"
                    ? "destructive"
                    : "secondary"
                }
              >
                {step.status}
              </Badge>
            </div>
            <Progress
              value={getStepProgress(step)}
              className={cn("h-1", {
                "bg-green-100": step.status === "completed",
                "bg-red-100": step.status === "error",
              })}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
