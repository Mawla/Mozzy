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
import type { ProcessingStatus } from "@/app/types/processing/base";
import type {
  PodcastProcessingStep,
  PodcastProcessingChunk,
  PodcastProcessingAnalysis,
} from "@/app/types/processing/podcast";
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities/podcast";

interface ProcessingPipelineProps {
  steps: PodcastProcessingStep[];
  onRetryStep: (stepId: string) => void;
  isProcessing: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

interface ExtendedProcessingStep extends PodcastProcessingStep {
  type?: "transcription" | "entity-extraction" | "summarization";
  data?: {
    entities?: ValidatedPodcastEntities;
    analysis?: PodcastProcessingAnalysis;
    [key: string]: any;
  };
}

// Type guards
const isTranscriptionStep = (step: ExtendedProcessingStep): boolean => {
  return step.type === "transcription";
};

const isEntityExtractionStep = (step: ExtendedProcessingStep): boolean => {
  return step.type === "entity-extraction" && step.data?.entities !== undefined;
};

const isSummarizationStep = (step: ExtendedProcessingStep): boolean => {
  return step.type === "summarization" && step.data?.analysis !== undefined;
};

const hasValidData = (step: ExtendedProcessingStep): boolean => {
  if (!step.data) return false;

  switch (step.type) {
    case "transcription":
      return true; // Transcription steps don't require specific data
    case "entity-extraction":
      return !!step.data.entities;
    case "summarization":
      return !!step.data.analysis;
    default:
      return true; // Default to true for unknown step types
  }
};

export const ProcessingPipeline = ({
  steps,
  onRetryStep,
  isProcessing,
  isOpen,
  onToggle,
}: ProcessingPipelineProps) => {
  const podcastProcessing = usePodcastProcessing();

  if (!steps || steps.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No processing steps available
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRetry = (stepId: string) => {
    if (typeof onRetryStep === "function") {
      onRetryStep(stepId);
    }
  };

  const getBadgeVariant = (
    status: ProcessingStatus
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "error":
      case "failed":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getBadgeContent = (status: ProcessingStatus): string => {
    switch (status) {
      case "completed":
        return "Completed";
      case "processing":
        return "Processing";
      case "error":
      case "failed":
        return "Error";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const renderStepContent = (step: ExtendedProcessingStep) => {
    if (!hasValidData(step)) {
      return (
        <div className="text-sm text-gray-500">
          No data available for this step
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={getBadgeVariant(step.status)}>
            {getBadgeContent(step.status)}
          </Badge>
          {(step.status === "error" || step.status === "failed") && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleRetry(step.id)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
        <StepDetails step={step} />
        {step.chunks && step.chunks.length > 0 && (
          <ChunkVisualizer chunks={step.chunks} />
        )}
        {step.networkLogs && step.networkLogs.length > 0 && (
          <NetworkLogger logs={step.networkLogs} />
        )}
      </div>
    );
  };

  const {
    chunks,
    networkLogs,
    selectedStep,
    activeTab,
    toggleStep,
    setActiveTab,
    getStepData,
  } = podcastProcessing;

  const handleTabChange = (value: string) => {
    if (value === "progress" || value === "chunks" || value === "logs") {
      setActiveTab(value);
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
