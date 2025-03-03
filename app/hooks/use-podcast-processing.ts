import { useState } from "react";
import { usePodcastProcessingStore } from "../store/podcastProcessingStore";
import type { NetworkLog } from "@/app/types/processing/base";
import type {
  PodcastProcessingStep,
  PodcastProcessingChunk,
} from "@/app/types/processing/podcast";

export type ProcessingTab = "progress" | "chunks" | "logs";

export function usePodcastProcessing() {
  // UI-specific state
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProcessingTab>("progress");

  // Get processing state from store
  const {
    chunks,
    networkLogs,
    processedTranscript,
    isProcessing,
    processingSteps,
    handlePodcastSubmit,
    handleRetryStep,
  } = usePodcastProcessingStore();

  // UI-specific actions
  const toggleStep = (stepId: string) => {
    setSelectedStep(selectedStep === stepId ? null : stepId);
  };

  // UI helper methods
  const isStepExpanded = (stepId: string) => selectedStep === stepId;

  const isStepComplete = (stepName: string) => {
    return processingSteps.some(
      (step) => step.name === stepName && step.status === "completed"
    );
  };

  const getStepData = (stepName: string) => {
    return processingSteps.find((step) => step.name === stepName)?.data || null;
  };

  return {
    // UI State
    selectedStep,
    activeTab,
    isStepExpanded,

    // UI Actions
    toggleStep,
    setActiveTab,

    // Processing State (from store)
    chunks,
    networkLogs,
    processedTranscript,
    isProcessing,
    processingSteps,

    // Processing Actions (from store)
    handlePodcastSubmit,
    handleRetryStep,

    // Helper Methods
    isStepComplete,
    getStepData,
  };
}
