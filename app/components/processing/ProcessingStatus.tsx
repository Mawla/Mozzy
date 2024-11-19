import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProcessingPipeline } from "@/app/core/processing";

interface ProcessingStatusProps {
  isProcessing: boolean;
  currentStep: string | null;
  pipeline: ProcessingPipeline<any, any, any>;
}

export function ProcessingStatus({
  isProcessing,
  currentStep,
  pipeline,
}: ProcessingStatusProps) {
  const steps = [
    { id: "chunking", name: "Text Chunking" },
    { id: "processing", name: "Content Processing" },
    { id: "combining", name: "Result Combination" },
  ];

  const getStepStatus = (stepId: string) => {
    const chunks = pipeline.getChunks();
    if (currentStep === stepId) return "Processing...";
    if (stepId === "chunking" && chunks.length > 0) return "Complete";
    return "Pending";
  };

  const getStepProgress = (stepId: string) => {
    const chunks = pipeline.getChunks();
    if (currentStep === stepId) return undefined;
    if (stepId === "chunking" && chunks.length > 0) return 100;
    return 0;
  };

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <Card key={step.id} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{step.name}</span>
            <span className="text-sm">{getStepStatus(step.id)}</span>
          </div>
          <Progress value={getStepProgress(step.id)} className="h-2" />
        </Card>
      ))}
    </div>
  );
}
