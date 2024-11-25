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
          // Complete transcript step
          updateStepStatus(PROCESSING_STEPS.TRANSCRIPT, "completed", {
            chunks: state.chunks,
            refinedContent: state.currentTranscript,
          });

          // Combine entities from all chunks
          const combinedEntities = state.chunks.reduce((acc, chunk) => {
            if (!chunk.entities) return acc;

            // Helper function to merge arrays with deduplication
            const mergeEntities = (
              accArray: any[] = [],
              newArray: any[] = []
            ) => {
              const map = new Map();
              [...accArray, ...newArray].forEach((e) => map.set(e.name, e));
              return Array.from(map.values());
            };

            return {
              people: mergeEntities(acc.people, chunk.entities.people),
              organizations: mergeEntities(
                acc.organizations,
                chunk.entities.organizations
              ),
              locations: mergeEntities(acc.locations, chunk.entities.locations),
              events: mergeEntities(acc.events, chunk.entities.events),
              topics: mergeEntities(acc.topics, chunk.entities.topics),
              concepts: mergeEntities(acc.concepts, chunk.entities.concepts),
            };
          }, {} as PodcastEntities);

          // Combine analysis from all chunks
          const combinedAnalysis = state.chunks.reduce((acc, chunk) => {
            if (!chunk.analysis) return acc;

            // Helper function to merge arrays
            const mergeArrays = (
              accArray: any[] = [],
              newArray: any[] = []
            ) => {
              const set = new Set([...accArray, ...newArray]);
              return Array.from(set);
            };

            return {
              summary: acc.summary || chunk.analysis.summary,
              keyPoints: mergeArrays(acc.keyPoints, chunk.analysis.keyPoints),
              themes: mergeArrays(acc.themes, chunk.analysis.themes),
            };
          }, {} as { summary?: string; keyPoints?: any[]; themes?: any[] });

          // Update steps with combined data
          if (Object.keys(combinedEntities).length > 0) {
            updateStepStatus(
              PROCESSING_STEPS.ENTITIES,
              "completed",
              combinedEntities
            );
          }

          if (Object.keys(combinedAnalysis).length > 0) {
            updateStepStatus(
              PROCESSING_STEPS.ANALYSIS,
              "completed",
              combinedAnalysis
            );
          }

          // Set processing to false when everything is complete
          set({ isProcessing: false });
        }
      }
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
