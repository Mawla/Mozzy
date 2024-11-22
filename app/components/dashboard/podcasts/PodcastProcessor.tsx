"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ProcessingPipeline } from "./ProcessingPipeline";
import { usePodcastProcessingStore } from "@/app/store/podcastProcessingStore";
import { PodcastProcessingService } from "@/app/services/podcastProcessingService";
import { ProcessingState } from "@/app/types/podcast/processing";

interface PodcastProcessorProps {
  onProcessingComplete: (result: ProcessingState) => void;
}

export const PodcastProcessor = ({
  onProcessingComplete,
}: PodcastProcessorProps) => {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"url" | "search" | "transcript">(
    "transcript"
  );
  const {
    isProcessing,
    processingSteps,
    handlePodcastSubmit,
    handleRetryStep,
  } = usePodcastProcessingStore();

  // Create processing service instance
  const processingService = new PodcastProcessingService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      // Use processingService directly
      await processingService.refineTranscript(input.trim());
      onProcessingComplete(processingService.getState());
    } catch (error) {
      console.error("Error processing podcast:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="search">Search</TabsTrigger>
              </TabsList>

              <TabsContent value="transcript" className="space-y-4">
                <Textarea
                  placeholder="Paste your transcript here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button type="submit" disabled={isProcessing || !input.trim()}>
                  Process Transcript
                </Button>
              </TabsContent>

              <TabsContent value="url">
                <Input
                  placeholder="Enter podcast URL"
                  type="url"
                  disabled={true}
                  className="mb-4"
                />
                <Button disabled={true}>Coming Soon</Button>
              </TabsContent>

              <TabsContent value="search">
                <Input
                  placeholder="Search for podcasts"
                  type="search"
                  disabled={true}
                  className="mb-4"
                />
                <Button disabled={true}>Coming Soon</Button>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>

      {processingSteps.some((step) => step.status !== "idle") && (
        <ProcessingPipeline
          steps={processingSteps}
          isProcessing={isProcessing}
          onRetryStep={handleRetryStep}
        />
      )}
    </div>
  );
};
