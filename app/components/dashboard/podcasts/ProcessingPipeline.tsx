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
import type {
  ProcessingStep,
  ProcessingStatus,
  ProcessingAnalysis,
} from "@/app/types/processing/base";
import type {
  ProcessingChunk,
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
} from "@/app/types/podcast/processing";

interface ValidatedEntities {
  people: PersonEntity[];
  organizations: OrganizationEntity[];
  locations: LocationEntity[];
  events: EventEntity[];
}

interface ProcessingPipelineProps {
  steps: ProcessingStep[];
  onRetryStep: (stepId: string) => void;
  isProcessing: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

interface ExtendedProcessingStep extends ProcessingStep {
  type?: "transcription" | "entity-extraction" | "summarization";
  data?: {
    entities?: ValidatedEntities;
    analysis?: ProcessingAnalysis;
    [key: string]: any;
  };
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
    if (step.status === "error" || step.status === "failed") {
      return (
        <div className="text-red-500 text-sm">
          {step.error instanceof Error
            ? step.error.message
            : "An error occurred during processing"}
        </div>
      );
    }

    if (step.type === "entity-extraction" && step.status === "completed") {
      const stepData = getStepData(step.id);
      if (stepData?.entities) {
        return (
          <StepDetails
            step={{ ...step, data: { entities: stepData.entities } }}
          />
        );
      }
    }

    return <StepDetails step={step} />;
  };

  const getBadgeVariant = (status: ProcessingStatus) => {
    switch (status) {
      case "completed":
        return "default";
      case "error":
      case "failed":
        return "destructive";
      case "processing":
      case "pending":
        return "secondary";
      case "idle":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getBadgeContent = (status: ProcessingStatus) => {
    switch (status) {
      case "processing":
      case "pending":
        return "Processing...";
      case "completed":
        return "Completed";
      case "error":
      case "failed":
        return "Error";
      case "idle":
        return "Ready";
      default:
        return status;
    }
  };

  return (
    <Card>
      <Accordion type="single" collapsible>
        <AccordionItem value="processing">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-xl font-bold">
                Processing Pipeline
              </CardTitle>
              <Badge
                variant={getBadgeVariant(steps[0]?.status || "idle")}
                className={cn(
                  (steps[0]?.status === "processing" ||
                    steps[0]?.status === "pending") &&
                    "animate-pulse"
                )}
              >
                {getBadgeContent(steps[0]?.status || "idle")}
              </Badge>
            </div>
          </AccordionTrigger>
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
                                  {step.status === "error" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onRetryStep(step.id);
                                      }}
                                    >
                                      <RefreshCw className="h-4 w-4 mr-1" />
                                      Retry
                                    </Button>
                                  )}
                                  <Badge
                                    variant={getBadgeVariant(step.status)}
                                    className={cn(
                                      (step.status === "processing" ||
                                        step.status === "pending") &&
                                        "animate-pulse"
                                    )}
                                  >
                                    {getBadgeContent(step.status)}
                                  </Badge>
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
