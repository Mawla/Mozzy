"use client";

import { useRouter } from "next/navigation";
import { PodcastProcessor } from "@/app/components/dashboard/podcasts/PodcastProcessor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PodcastInput } from "@/app/components/dashboard/podcasts/PodcastInput";
import { ProcessingPipeline } from "@/app/components/dashboard/podcasts/ProcessingPipeline";
import { usePodcastProcessingStore } from "@/app/store/podcastProcessingStore";

const NewPodcastPage = () => {
  const router = useRouter();
  const {
    isProcessing,
    processingSteps,
    handlePodcastSubmit,
    handleRetryStep,
  } = usePodcastProcessingStore();

  const handleProcessingComplete = (podcastId: string) => {
    router.push(`/dashboard/podcasts/${podcastId}`);
  };

  const handleSubmit = async (data: {
    type: "url" | "search" | "transcript";
    content: string;
  }) => {
    try {
      await handlePodcastSubmit(data);
      // handleProcessingComplete will be called from the store after successful processing
    } catch (error) {
      console.error("Error processing podcast:", error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">New Podcast</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <PodcastInput onSubmit={handleSubmit} isProcessing={isProcessing} />
      </Card>

      {processingSteps.some((step) => step.status !== "idle") && (
        <ProcessingPipeline
          steps={processingSteps}
          onRetryStep={handleRetryStep}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default NewPodcastPage;
