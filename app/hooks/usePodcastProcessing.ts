"use client";

import { useState, useEffect } from "react";
import { PodcastProcessingService } from "@/app/services/podcastProcessingService";
import {
  ProcessingStep,
  ProcessingResult,
} from "@/app/types/podcast/processing";

export const usePodcastProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { name: "Transcript Refinement", status: "idle", data: null },
    { name: "Content Analysis", status: "idle", data: null },
    { name: "Entity Extraction", status: "idle", data: null },
    { name: "Timeline Creation", status: "idle", data: null },
  ]);

  const [service] = useState(() => new PodcastProcessingService());

  useEffect(() => {
    const unsubscribe = service.subscribe((state) => {
      // Update the Transcript Refinement step with chunking data
      setSteps((currentSteps) =>
        currentSteps.map((step) =>
          step.name === "Transcript Refinement"
            ? {
                ...step,
                data: {
                  ...step.data,
                  chunks: state.chunks,
                  networkLogs: state.networkLogs,
                },
              }
            : step
        )
      );
    });

    return () => {
      unsubscribe();
    };
  }, [service]);

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

  const processTranscript = async (
    transcript: string
  ): Promise<ProcessingResult> => {
    setIsProcessing(true);

    try {
      // Step 1: Refine Transcript
      updateStepStatus("Transcript Refinement", "processing");
      const { refinedTranscript } = await service.refineTranscript(transcript);
      updateStepStatus("Transcript Refinement", "completed", refinedTranscript);

      // Step 2: Analyze Content
      updateStepStatus("Content Analysis", "processing");
      const analysis = await service.analyzeContent(refinedTranscript);
      updateStepStatus("Content Analysis", "completed", analysis);

      // Step 3: Extract Entities
      updateStepStatus("Entity Extraction", "processing");
      const entities = await service.extractEntities(refinedTranscript);
      updateStepStatus("Entity Extraction", "completed", entities);

      // Step 4: Create Timeline
      updateStepStatus("Timeline Creation", "processing");
      const timeline = await service.createTimeline(refinedTranscript);
      updateStepStatus("Timeline Creation", "completed", timeline);

      return {
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
    const step = steps.find((s) => s.name === stepName);
    if (!step) return;

    const transcript = steps[0].data?.refinedTranscript || "";
    if (!transcript) {
      console.error("No transcript available for retry");
      return;
    }

    setIsProcessing(true);

    try {
      switch (stepName) {
        case "Content Analysis":
          const analysis = await service.analyzeContent(transcript);
          updateStepStatus(stepName, "completed", analysis);
          break;
        case "Entity Extraction":
          const entities = await service.extractEntities(transcript);
          updateStepStatus(stepName, "completed", entities);
          break;
        case "Timeline Creation":
          const timeline = await service.createTimeline(transcript);
          updateStepStatus(stepName, "completed", timeline);
          break;
        default:
          console.warn(`Retry not implemented for step: ${stepName}`);
      }
    } catch (error) {
      console.error(`Error retrying step ${stepName}:`, error);
      updateStepStatus(stepName, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    steps,
    processTranscript,
    retryStep,
  };
};
