"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { TiptapPreview } from "./TiptapPreview";
import { ChunkVisualizer } from "./ChunkVisualizer";

interface ProcessingStep {
  name: string;
  status: "idle" | "processing" | "completed" | "error";
  data: any;
  dependsOn?: string[];
}

interface ProcessingPipelineProps {
  steps: ProcessingStep[];
  onRetryStep: (stepName: string) => void;
  isProcessing: boolean;
}

export const ProcessingPipeline = ({
  steps,
  onRetryStep,
  isProcessing,
}: ProcessingPipelineProps) => {
  const [selectedStep, setSelectedStep] = useState<string>(
    steps[0]?.name || ""
  );

  const getStatusColor = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "idle":
        return "bg-gray-200 text-gray-700";
      case "processing":
        return "bg-blue-200 text-blue-700";
      case "completed":
        return "bg-green-200 text-green-700";
      case "error":
        return "bg-red-200 text-red-700";
    }
  };

  const renderStepData = (step: ProcessingStep) => {
    if (!step.data) return null;

    // If the data is a string, render it with Tiptap
    if (typeof step.data === "string") {
      return <TiptapPreview content={step.data} />;
    }

    // If the data is an array, render each item with Tiptap if it's a string
    if (Array.isArray(step.data)) {
      return (
        <div className="space-y-4">
          {step.data.map((item, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              {typeof item === "string" ? (
                <TiptapPreview content={item} />
              ) : (
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(item, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      );
    }

    // If the data is an object, render each value with Tiptap if it's a string
    if (typeof step.data === "object") {
      return (
        <div className="space-y-4">
          {Object.entries(step.data).map(([key, value]) => (
            <div key={key}>
              <h4 className="text-sm font-medium text-gray-500 mb-1">{key}</h4>
              <div className="p-2 bg-gray-50 rounded">
                {typeof value === "string" ? (
                  <TiptapPreview content={value} />
                ) : (
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-2 rounded">
        {JSON.stringify(step.data, null, 2)}
      </pre>
    );
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Processing Pipeline</CardTitle>
        <div className="flex gap-2 mt-2 flex-wrap">
          {steps.map((step) => (
            <div key={step.name} className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={`${getStatusColor(step.status)}`}
              >
                {step.name}
                {step.status === "processing" && (
                  <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                )}
              </Badge>
              {step.status === "error" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRetryStep(step.name)}
                  disabled={isProcessing}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {steps[0]?.status === "processing" && steps[0]?.data?.chunks && (
          <div className="mb-6">
            <ChunkVisualizer
              chunks={steps[0].data.chunks}
              networkLogs={steps[0].data.networkLogs}
            />
          </div>
        )}
        <Tabs
          value={selectedStep}
          onValueChange={setSelectedStep}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 lg:grid-cols-5 mb-4">
            {steps.map((step) => (
              <TabsTrigger key={step.name} value={step.name}>
                {step.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {steps.map((step) => (
            <TabsContent key={step.name} value={step.name}>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                {step.status === "processing" ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : step.status === "error" ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <p className="text-red-600">Processing failed</p>
                    <Button
                      onClick={() => onRetryStep(step.name)}
                      disabled={isProcessing}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Step
                    </Button>
                  </div>
                ) : (
                  renderStepData(step)
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
