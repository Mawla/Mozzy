"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParallelProcessingStatus } from "../dashboard/podcasts/ParallelProcessingStatus";
import { ChunkVisualizer } from "../dashboard/podcasts/ChunkVisualizer";
import { TiptapPreview } from "../dashboard/podcasts/TiptapPreview";
import { NetworkLogger } from "../dashboard/podcasts/NetworkLogger";
import { ProcessingPipeline } from "@/app/core/processing";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProcessingStep } from "@/app/types/podcast/processing";
import { Progress } from "@/components/ui/progress";
import { StepDetails } from "../dashboard/podcasts/StepDetails/StepDetails";

interface ProcessingPipelineViewProps {
  pipeline: ProcessingPipeline<string, any, any>;
  content: string;
}

export function ProcessingPipelineView({
  pipeline,
  content,
}: ProcessingPipelineViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "chunks" | "results" | "logs"
  >("overview");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [logs, setLogs] = useState<
    Array<{
      type: "request" | "response" | "error";
      message: string;
      timestamp: string;
    }>
  >([]);
  const [results, setResults] = useState<Record<string, any>>({});

  const steps: ProcessingStep[] = [
    {
      id: "chunking",
      name: "Text Chunking",
      status: isProcessing ? "processing" : "idle",
      data: results.chunking || null,
    },
    {
      id: "analysis",
      name: "Content Analysis",
      status: "idle",
      data: results.analysis || null,
    },
    {
      id: "entities",
      name: "Entity Extraction",
      status: "idle",
      data: results.entities || null,
    },
    {
      id: "timeline",
      name: "Timeline Creation",
      status: "idle",
      data: results.timeline || null,
    },
  ];

  const handleProcessing = async () => {
    setIsProcessing(true);
    try {
      // Process content
      setCurrentStep("chunking");
      const processedChunks = pipeline.getChunks();
      setResults((prev) => ({
        ...prev,
        chunking: { chunks: processedChunks },
      }));

      // Process each step
      for (const step of steps) {
        if (step.id === "chunking") continue;

        setCurrentStep(step.id);
        const stepResult = await pipeline.processStep(step.id);
        setResults((prev) => ({ ...prev, [step.id]: stepResult }));
      }

      setCurrentStep("combining");
      const finalResult = await pipeline.process(content);
      setResults((prev) => ({ ...prev, final: finalResult }));
    } catch (err) {
      // Type guard for Error objects
      const error = err as Error;
      console.error("Processing error:", error);
      setLogs((prev) => [
        ...prev,
        {
          type: "error",
          message: error?.message || "An unknown error occurred",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsProcessing(false);
      setCurrentStep(null);
    }
  };

  const getOverallProgress = () => {
    const completedSteps = steps.filter((s) => s.status === "completed").length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Processing Pipeline</CardTitle>
            <Button onClick={handleProcessing} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Start Processing"}
            </Button>
          </div>
          {isProcessing && (
            <Progress value={getOverallProgress()} className="w-full" />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chunks">Chunks</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <ParallelProcessingStatus
                steps={steps}
                currentStep={currentStep}
              />
              {/* Show current step details */}
              {currentStep && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Current Step Output
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StepDetails
                      step={steps.find((s) => s.id === currentStep) || steps[0]}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chunks">
            <ChunkVisualizer chunks={pipeline.getChunks()} />
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              {steps.map((step) => (
                <Card key={step.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {step.name} Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StepDetails step={step} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <NetworkLogger logs={logs} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
