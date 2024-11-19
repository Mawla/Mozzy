"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RefreshCw } from "lucide-react";
import { StepStatusIcon } from "./StepStatusIcon";
import { ChunkVisualizer } from "./ChunkVisualizer";
import { NetworkLogger } from "./NetworkLogger";
import { StepDetails } from "./StepDetails/StepDetails";
import { usePodcastProcessing } from "@/app/hooks/use-podcast-processing";
import { cn } from "@/lib/utils";
import { ParallelProcessingStatus } from "./ParallelProcessingStatus";
import { ProcessingStep } from "@/app/types/podcast/processing";

interface ProcessingPipelineProps {
  steps: ProcessingStep[];
  onRetryStep: (stepId: string) => void;
  isProcessing: boolean;
}

export const ProcessingPipeline = ({
  steps,
  onRetryStep,
  isProcessing,
}: ProcessingPipelineProps) => {
  const {
    chunks,
    networkLogs,
    processedTranscript,
    selectedStep,
    activeTab,
    toggleStep,
    setActiveTab,
  } = usePodcastProcessing();

  const handleTabChange = (value: string) => {
    if (
      value === "progress" ||
      value === "chunks" ||
      value === "result" ||
      value === "logs"
    ) {
      setActiveTab(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Processing Pipeline</span>
          {isProcessing && (
            <Badge variant="secondary" className="animate-pulse">
              Processing...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="chunks">Chunks</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4 mt-4">
            <ParallelProcessingStatus
              steps={steps}
              currentStep={selectedStep}
            />
            {steps.map((step) => (
              <Collapsible
                key={step.id}
                open={selectedStep === step.id}
                onOpenChange={() => toggleStep(step.id)}
              >
                <Card
                  className={cn(
                    "transition-colors",
                    step.status === "completed" && "border-green-200",
                    step.status === "error" && "border-red-200",
                    step.status === "processing" && "border-blue-200"
                  )}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StepStatusIcon status={step.status} />
                          <span className="font-medium">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
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
                          {step.status === "error" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRetryStep(step.id);
                              }}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />
                      <StepDetails step={step} />
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </TabsContent>

          <TabsContent value="chunks">
            <ScrollArea className="h-[500px] rounded-md border p-4">
              <ChunkVisualizer chunks={chunks} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="result">
            <ScrollArea className="h-[500px] rounded-md border p-4">
              {processedTranscript ? (
                <div className="prose max-w-none">
                  <p>{processedTranscript}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No processed content yet
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="logs">
            <ScrollArea className="h-[500px] rounded-md border">
              <NetworkLogger logs={networkLogs || []} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
