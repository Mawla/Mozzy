"use client";

import { useState } from "react";
import { PodcastProcessingService } from "@/app/services/podcastProcessingService";
import { ProcessingStep } from "@/app/types/podcast/models";

export const usePodcastProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { name: "Transcript Refinement", status: "idle", data: null },
    { name: "Content Analysis", status: "idle", data: null },
    { name: "Entity Extraction", status: "idle", data: null },
    { name: "Timeline Creation", status: "idle", data: null },
  ]);

  const updateStepStatus = (
    stepName: string,
    status: ProcessingStep["status"],
    data?: any
  ) => {
    setSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.name === stepName
          ? { ...step, status, data: data || step.data }
          : step
      )
    );
  };

  const processTranscript = async (transcript: string) => {
    setIsProcessing(true);
    const service = new PodcastProcessingService();

    try {
      // Step 1: Refine Transcript
      updateStepStatus("Transcript Refinement", "processing");
      const refinedTranscript = await service.refineTranscript(transcript);
      updateStepStatus("Transcript Refinement", "completed", refinedTranscript);

      // Step 2: Analyze Content
      updateStepStatus("Content Analysis", "processing");
      const analysis = await service.analyzeContent(
        refinedTranscript.refinedContent
      );
      updateStepStatus("Content Analysis", "completed", analysis);

      // Step 3: Extract Entities
      updateStepStatus("Entity Extraction", "processing");
      const entities = await service.extractEntities(
        refinedTranscript.refinedContent
      );
      updateStepStatus("Entity Extraction", "completed", entities);

      // Step 4: Create Timeline
      updateStepStatus("Timeline Creation", "processing");
      const timeline = await service.createTimeline(
        refinedTranscript.refinedContent
      );
      updateStepStatus("Timeline Creation", "completed", timeline);

      return {
        id: analysis.id,
        transcript: refinedTranscript,
        analysis,
        entities,
        timeline,
      };
    } catch (error) {
      console.error("Error in podcast processing:", error);
      const failedStep = steps.find((step) => step.status === "processing");
      if (failedStep) {
        updateStepStatus(failedStep.name, "error");
      }
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const retryStep = async (stepName: string) => {
    // Implementation for retrying a specific step
    // This would need to consider dependencies between steps
    console.log("Retrying step:", stepName);
  };

  return {
    isProcessing,
    steps,
    processTranscript,
    retryStep,
  };
};
