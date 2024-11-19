import { create } from "zustand";
import { PodcastProcessingService } from "@/app/services/podcastProcessingService";
import {
  ProcessingStep,
  ProcessingChunk,
  NetworkLog,
  PodcastAnalysis,
  PodcastEntities,
  TimelineEvent,
} from "@/app/types/podcast/processing";
import { PROCESSING_STEPS, INITIAL_STEPS } from "@/app/constants/processing";

interface PodcastProcessingState {
  isProcessing: boolean;
  processingSteps: ProcessingStep[];
  processedTranscript: string | null;
  chunks: ProcessingChunk[];
  networkLogs: NetworkLog[];
  service: PodcastProcessingService;

  handlePodcastSubmit: (data: {
    type: "url" | "search" | "transcript";
    content: string;
  }) => Promise<void>;
  handleRetryStep: (stepName: string) => Promise<void>;
  updateStepStatus: (
    stepName: string,
    status: ProcessingStep["status"],
    data?: any
  ) => void;
  updateChunks: (chunks: ProcessingChunk[]) => void;
  updateNetworkLogs: (logs: NetworkLog[]) => void;
}

export const usePodcastProcessingStore = create<PodcastProcessingState>(
  (set, get) => {
    const service = new PodcastProcessingService();

    // Subscribe to service updates
    service.subscribe((state) => {
      const { updateStepStatus, updateChunks, updateNetworkLogs } = get();

      // Update UI state
      updateChunks(state.chunks);
      updateNetworkLogs(state.networkLogs);

      // Update processing status
      if (state.chunks.length > 0) {
        set({ isProcessing: true });

        // Update transcript step status
        updateStepStatus(PROCESSING_STEPS.TRANSCRIPT, "processing", {
          chunks: state.chunks,
        });

        // Check if all chunks are completed
        const allChunksCompleted = state.chunks.every(
          (chunk) => chunk.status === "completed"
        );

        if (allChunksCompleted) {
          updateStepStatus(PROCESSING_STEPS.TRANSCRIPT, "completed", {
            chunks: state.chunks,
            refinedContent: state.currentTranscript,
          });
        }
      }

      // Update other steps based on chunk data
      state.chunks.forEach((chunk) => {
        if (chunk.status === "completed") {
          if (chunk.analysis) {
            updateStepStatus(
              PROCESSING_STEPS.ANALYSIS,
              "processing",
              chunk.analysis
            );
          }
          if (chunk.entities) {
            updateStepStatus(
              PROCESSING_STEPS.ENTITIES,
              "processing",
              chunk.entities
            );
          }
          if (chunk.timeline) {
            updateStepStatus(PROCESSING_STEPS.TIMELINE, "processing", {
              timeline: chunk.timeline,
            });
          }
        }
      });
    });

    return {
      isProcessing: false,
      processedTranscript: null,
      service,
      chunks: [],
      networkLogs: [],
      processingSteps: INITIAL_STEPS,

      updateChunks: (chunks) => set({ chunks }),
      updateNetworkLogs: (logs) => set({ networkLogs: logs }),

      updateStepStatus: (stepName, status, data) =>
        set((state) => ({
          processingSteps: state.processingSteps.map((step) =>
            step.name === stepName
              ? {
                  ...step,
                  status,
                  data: {
                    ...(step.data || {}),
                    ...(data || {}),
                  },
                }
              : step
          ),
        })),

      handlePodcastSubmit: async ({ type, content }) => {
        set({
          isProcessing: true,
          chunks: [],
          networkLogs: [],
          processingSteps: get().processingSteps.map((step) => ({
            ...step,
            status: "idle",
            data: null,
          })),
        });

        try {
          const result = await service.refineTranscript(content);
          set({ processedTranscript: result.refinedTranscript });
        } catch (error) {
          console.error("Store: Error in handlePodcastSubmit:", error);
          const currentStep = get().processingSteps.find(
            (step) => step.status === "processing"
          );
          if (currentStep) {
            set((state) => ({
              processingSteps: state.processingSteps.map((step) =>
                step.name === currentStep.name
                  ? { ...step, status: "error", error: error as Error }
                  : step
              ),
            }));
          }
          throw error;
        } finally {
          set({ isProcessing: false });
        }
      },

      handleRetryStep: async (stepName) => {
        const { updateStepStatus, service } = get();
        const transcriptStep = get().processingSteps[0];
        const refinedContent = transcriptStep?.data?.refinedContent;

        if (!refinedContent) {
          console.error("No transcript available for retry");
          return;
        }

        set({ isProcessing: true });
        updateStepStatus(stepName, "processing");

        try {
          const result = await service.refineTranscript(refinedContent);
          set({ processedTranscript: result.refinedTranscript });
        } catch (error) {
          console.error(`Error retrying step ${stepName}:`, error);
          updateStepStatus(stepName, "error");
        } finally {
          set({ isProcessing: false });
        }
      },
    };
  }
);
