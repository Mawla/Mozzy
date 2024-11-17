"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
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
import { usePodcastProcessingStore } from "@/app/store/podcastProcessingStore";

interface StepData extends Omit<BaseStepData, "chunks"> {
  chunks?: ProcessingChunk[];
}

interface ProcessingPipelineProps {
  steps: Array<{
    id: string;
    name: string;
    status: "idle" | "processing" | "completed" | "error";
    error?: string;
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

export const ProcessingPipeline = ({
  steps,
  onRetryStep,
  isProcessing,
}: ProcessingPipelineProps) => {
  const { chunks, networkLogs, processedTranscript } =
    usePodcastProcessingStore();
  const [activeTab, setActiveTab] = useState("progress");

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="chunks">Chunks</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border"
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
                      onClick={() => onRetryStep(step.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
