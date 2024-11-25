"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RefreshCw } from "lucide-react";
import { StepStatusIcon } from "./StepStatusIcon";
import { ChunkVisualizer } from "./ChunkVisualizer";
import { NetworkLogger } from "./NetworkLogger";
import { StepDetails } from "./StepDetails/StepDetails";
import { usePodcastProcessing } from "@/app/hooks/use-podcast-processing";
import { cn } from "@/lib/utils";
import { ParallelProcessingStatus } from "./ParallelProcessingStatus";
import { ProcessingStep } from "@/app/types/podcast/processing";
import { PodcastEntities } from "@/app/schemas/podcast/entities";

interface ProcessingPipelineProps {
  steps: ProcessingStep[];
  onRetryStep: (stepId: string) => void;
  isProcessing: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

interface ExtendedProcessingStep extends Omit<ProcessingStep, "data"> {
  type?: "transcription" | "entity-extraction" | "summarization";
  error?: string | Error;
  data?: StepData | null;
}

interface StepData {
  entities?: PodcastEntities;
  result?: any;
  [key: string]: any;
}

export const ProcessingPipeline = ({
  steps,
  onRetryStep,
  isProcessing,
  isOpen,
  onToggle,
}: ProcessingPipelineProps) => {
  const {
    chunks,
    networkLogs,
    selectedStep,
    activeTab,
    toggleStep,
    setActiveTab,
    getStepData,
  } = usePodcastProcessing();

  const handleTabChange = (value: string) => {
    if (value === "progress" || value === "chunks" || value === "logs") {
      setActiveTab(value);
    }
  };

  const renderStepContent = (step: ExtendedProcessingStep) => {
    if (step.status === "error") {
      return (
        <div className="text-red-500 text-sm">
          {(step.error instanceof Error ? step.error.message : step.error) ||
            "An error occurred during processing"}
        </div>
      );
    }

    if (step.type === "entity-extraction" && step.status === "completed") {
      const stepData = getStepData(step.id) as StepData;
      if (stepData?.entities) {
        const stepWithData: ExtendedProcessingStep = {
          ...step,
          data: { entities: stepData.entities },
        };
        return <StepDetails step={stepWithData} />;
      }
    }

    return <StepDetails step={step} />;
  };

  return (
    <Card>
      <Accordion type="single" collapsible defaultValue="pipeline">
        <AccordionItem value="pipeline" className="border-none">
          <CardHeader className="border-b">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <CardTitle>Processing Pipeline</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isProcessing ? "secondary" : "outline"}
                    className={cn(isProcessing && "animate-pulse")}
                  >
                    {isProcessing ? "Processing..." : "Ready"}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
          </CardHeader>

          <AccordionContent>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="mt-4"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="chunks">Chunks</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="progress" className="space-y-4 mt-4">
                  <ParallelProcessingStatus
                    steps={steps}
                    currentStep={selectedStep}
                  />
                  <div className="space-y-2">
                    {steps.map((step) => (
                      <div
                        key={step.id}
                        className="rounded-lg border bg-card text-card-foreground"
                      >
                        <Accordion type="single" collapsible>
                          <AccordionItem
                            value={step.id}
                            className="border-none"
                          >
                            <AccordionTrigger className="px-4 py-2 hover:no-underline">
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                  <StepStatusIcon status={step.status} />
                                  <span className="font-medium">
                                    {step.name}
                                  </span>
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
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              {renderStepContent(
                                step as ExtendedProcessingStep
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="chunks">
                  <ScrollArea className="h-[500px] rounded-md border p-4">
                    <ChunkVisualizer chunks={chunks || []} />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="logs">
                  <ScrollArea className="h-[500px] rounded-md border">
                    <NetworkLogger logs={networkLogs || []} />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
