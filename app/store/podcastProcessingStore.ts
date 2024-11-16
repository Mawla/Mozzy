import { create } from "zustand";
import {
  ProcessingStep,
  PodcastInput,
  PodcastProcessingState,
} from "@/app/types/podcast/models";
import { PodcastProcessingService } from "@/app/services/podcastProcessingService";

const podcastProcessingService = new PodcastProcessingService();

const initialSteps: ProcessingStep[] = [
  { name: "Transcript Refinement", status: "idle", data: null },
  {
    name: "Content Analysis",
    status: "idle",
    data: null,
    dependsOn: ["Transcript Refinement"],
  },
  {
    name: "Entity Extraction",
    status: "idle",
    data: null,
    dependsOn: ["Transcript Refinement"],
  },
  {
    name: "Timeline Creation",
    status: "idle",
    data: null,
    dependsOn: ["Transcript Refinement"],
  },
];

export const usePodcastProcessingStore = create<PodcastProcessingState>(
  (set, get) => ({
    isProcessing: false,
    inputData: null,
    processingSteps: initialSteps,
    currentPodcast: null,

    setProcessing: (isProcessing: boolean) => set({ isProcessing }),

    setInputData: (data: PodcastInput | null) => set({ inputData: data }),

    updateStepStatus: (
      stepName: string,
      status: ProcessingStep["status"],
      data?: any
    ) =>
      set((state) => ({
        processingSteps: state.processingSteps.map((step) =>
          step.name === stepName
            ? { ...step, status, ...(data ? { data } : {}) }
            : step
        ),
      })),

    processStep: async (step: ProcessingStep) => {
      const { inputData, updateStepStatus } = get();

      if (!inputData) return false;

      updateStepStatus(step.name, "processing");

      try {
        let result;
        switch (step.name) {
          case "Transcript Refinement":
            result = await podcastProcessingService.refineTranscript(
              inputData.content
            );
            break;
          case "Content Analysis":
            result = await podcastProcessingService.analyzeContent(
              inputData.content
            );
            break;
          case "Entity Extraction":
            result = await podcastProcessingService.extractEntities(
              inputData.content
            );
            break;
          case "Timeline Creation":
            result = await podcastProcessingService.createTimeline(
              inputData.content
            );
            break;
          default:
            throw new Error(`Unknown step: ${step.name}`);
        }

        updateStepStatus(step.name, "completed", result);
        return true;
      } catch (error) {
        console.error(`Error processing ${step.name}:`, error);
        updateStepStatus(step.name, "error");
        return false;
      }
    },

    handlePodcastSubmit: async (data: PodcastInput) => {
      const { setProcessing, setInputData, processStep, processingSteps } =
        get();

      setProcessing(true);
      setInputData(data);

      try {
        // Reset all steps
        processingSteps.forEach((step) => {
          get().updateStepStatus(step.name, "idle");
        });

        // Process steps sequentially
        for (const step of processingSteps) {
          const success = await processStep(step);
          if (!success) break;
        }
      } finally {
        setProcessing(false);
      }
    },

    handleRetryStep: async (stepName: string) => {
      const { setProcessing, processStep, processingSteps } = get();
      const step = processingSteps.find((s) => s.name === stepName);
      if (!step) return;

      setProcessing(true);
      try {
        const success = await processStep(step);

        if (success) {
          // If successful, process subsequent steps
          const subsequentSteps = processingSteps.slice(
            processingSteps.findIndex((s) => s.name === stepName) + 1
          );

          for (const nextStep of subsequentSteps) {
            const nextSuccess = await processStep(nextStep);
            if (!nextSuccess) break;
          }
        }
      } finally {
        setProcessing(false);
      }
    },

    reset: () =>
      set({
        isProcessing: false,
        inputData: null,
        processingSteps: initialSteps,
        currentPodcast: null,
      }),
  })
);
