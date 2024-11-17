"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { TiptapPreview } from "./TiptapPreview";
import { ChunkVisualizer } from "./ChunkVisualizer";
import { NetworkLogger } from "./NetworkLogger";
import {
  ProcessingStep,
  TranscriptStepData,
  AnalysisStepData,
  EntityStepData,
  TimelineEvent,
  NetworkLog,
  QuickFact,
  KeyPoint,
  Theme,
  ProcessingChunk,
  StepData as BaseStepData,
} from "@/app/types/podcast/processing";
import { usePodcastProcessing } from "@/app/hooks/use-podcast-processing";

interface StepData extends Omit<BaseStepData, "chunks"> {
  chunks?: ProcessingChunk[];
}

interface ProcessingPipelineProps {
  steps: Array<{
    id: string;
    name: string;
    status: "idle" | "processing" | "completed" | "error";
    error?: string;
    data?: any;
  }>;
  onRetryStep: (stepId: string) => void;
  isProcessing: boolean;
}

function isTranscriptData(
  data: StepData
): data is StepData & Pick<TranscriptStepData, "refinedContent"> {
  return "refinedContent" in data;
}

function isAnalysisData(data: StepData): data is AnalysisStepData {
  return "title" in data || "summary" in data || "quickFacts" in data;
}

function isEntityData(data: StepData): data is EntityStepData {
  return "people" in data || "organizations" in data;
}

function isTimelineData(
  data: StepData
): data is StepData & { timeline: TimelineEvent[] } {
  return (
    "timeline" in data &&
    Array.isArray(data.timeline) &&
    data.timeline.length > 0 &&
    "importance" in data.timeline[0]
  );
}

const StepDetails = ({
  step,
}: {
  step: {
    name: string;
    status: string;
    data?: any;
    error?: string;
  };
}) => {
  if (!step.data) return null;

  switch (step.name) {
    case "Content Analysis":
      return (
        <div className="mt-4 space-y-4">
          {step.data.summary && (
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-gray-600">{step.data.summary}</p>
            </div>
          )}
          {step.data.keyPoints && (
            <div>
              <h4 className="font-medium mb-2">Key Points</h4>
              <ul className="list-disc list-inside space-y-2">
                {step.data.keyPoints.map((point: KeyPoint, index: number) => (
                  <li key={index} className="text-sm text-gray-600">
                    <span className="font-medium">{point.title}</span>:{" "}
                    {point.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {step.data.themes && (
            <div>
              <h4 className="font-medium mb-2">Themes</h4>
              <div className="space-y-2">
                {step.data.themes.map((theme: Theme, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <h5 className="font-medium">{theme.name}</h5>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case "Entity Extraction":
      return (
        <div className="mt-4 space-y-4">
          {step.data.people && (
            <div>
              <h4 className="font-medium mb-2">People</h4>
              <div className="flex flex-wrap gap-2">
                {step.data.people.map((person: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {person}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {step.data.organizations && (
            <div>
              <h4 className="font-medium mb-2">Organizations</h4>
              <div className="flex flex-wrap gap-2">
                {step.data.organizations.map((org: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {org}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {step.data.locations && (
            <div>
              <h4 className="font-medium mb-2">Locations</h4>
              <div className="flex flex-wrap gap-2">
                {step.data.locations.map((location: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case "Timeline Creation":
      return (
        <div className="mt-4">
          <div className="space-y-4">
            {step.data.timeline?.map((event: TimelineEvent, index: number) => (
              <div
                key={index}
                className={`p-3 rounded border-l-4 ${
                  event.importance === "high"
                    ? "border-blue-500 bg-blue-50"
                    : event.importance === "medium"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-500 bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">{event.time}</span>
                  <Badge
                    variant="secondary"
                    className={
                      event.importance === "high"
                        ? "bg-blue-100"
                        : event.importance === "medium"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }
                  >
                    {event.importance}
                  </Badge>
                </div>
                <p className="text-sm mt-1">{event.event}</p>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};

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
    isStepComplete,
    getStepData,
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

  const getStepBadgeVariant = (
    status: "idle" | "processing" | "completed" | "error"
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "completed":
        return "default";
      case "error":
        return "destructive";
      case "processing":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Processing Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="chunks">Chunks</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            {steps.map((step) => (
              <div key={step.id}>
                <div
                  className="flex items-center justify-between p-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleStep(step.id)}
                >
                  <div className="flex items-center gap-3">
                    {step.status === "processing" && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                    {step.status === "completed" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {step.status === "error" && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">{step.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStepBadgeVariant(step.status)}
                      className={
                        step.status === "completed"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
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
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        selectedStep === step.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
                {selectedStep === step.id && step.status === "completed" && (
                  <div className="mt-2 ml-8 p-4 border-l-2 border-gray-200">
                    <StepDetails step={step} />
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="chunks">
            <ScrollArea className="h-[400px]">
              {chunks?.length > 0 ? (
                <ChunkVisualizer chunks={chunks} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No chunks processed yet
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="result">
            <ScrollArea className="h-[400px]">
              {processedTranscript ? (
                <TiptapPreview content={processedTranscript} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No processed content yet
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="logs">
            <ScrollArea className="h-[400px]">
              <NetworkLogger logs={networkLogs || []} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
