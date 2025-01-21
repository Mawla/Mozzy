import { create } from "zustand";
import { PodcastProcessingService } from "@/app/services/podcastProcessingService";
import type { NetworkLog, BaseTextChunk } from "@/app/types/processing/base";
import type {
  PodcastProcessingStep,
  PodcastProcessingChunk,
  PodcastProcessingAnalysis,
  PodcastProcessingResult,
} from "@/app/types/processing/podcast";
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities/podcast";
import { PROCESSING_STEPS, INITIAL_STEPS } from "@/app/constants/processing";

type ProcessingEntities = ValidatedPodcastEntities;

interface PodcastProcessingState {
  isProcessing: boolean;
  processingSteps: PodcastProcessingStep[];
  processedTranscript: string | null;
  chunks: PodcastProcessingChunk[];
  networkLogs: NetworkLog[];
  service: PodcastProcessingService;

  handlePodcastSubmit: (data: {
    type: "url" | "search" | "transcript";
    content: string;
  }) => Promise<void>;
  handleRetryStep: (stepName: string) => Promise<void>;
  updateStepStatus: (
    stepName: string,
    status: PodcastProcessingStep["status"],
    data?: any
  ) => void;
  updateChunks: (chunks: PodcastProcessingChunk[]) => void;
  updateNetworkLogs: (logs: NetworkLog[]) => void;
}

// Utility function to convert BaseTextChunk to PodcastProcessingChunk
const convertToProcessingChunk = (
  chunk: BaseTextChunk
): PodcastProcessingChunk => ({
  ...chunk,
  status: "pending",
});

export const usePodcastProcessingStore = create<PodcastProcessingState>(
  (set, get) => {
    const service = new PodcastProcessingService();

    // Subscribe to service updates
    service.subscribe((state) => {
      const { updateStepStatus, updateChunks, updateNetworkLogs } = get();

      // Update UI state
      updateChunks(state.chunks.map(convertToProcessingChunk));
      updateNetworkLogs(state.networkLogs);

      // Update processing status
      if (state.chunks.length > 0) {
        set({ isProcessing: true });

        // Update transcript step status
        updateStepStatus(PROCESSING_STEPS.TRANSCRIPT, "processing", {
          chunks: state.chunks.map(convertToProcessingChunk),
        });

        // Check if all chunks are completed
        const allChunksCompleted = state.chunks.every((chunk) => {
          const processingChunk = chunk as PodcastProcessingChunk;
          return processingChunk.status === "completed";
        });

        if (allChunksCompleted) {
          // Complete transcript step
          updateStepStatus(PROCESSING_STEPS.TRANSCRIPT, "completed", {
            chunks: state.chunks.map(convertToProcessingChunk),
            refinedContent: state.currentTranscript,
          });

          // Combine entities from all chunks
          const combinedEntities = state.chunks.reduce((acc, chunk) => {
            const result = (chunk as PodcastProcessingChunk).result;
            if (!result?.entities) return acc;

            // Helper function to merge arrays with deduplication
            const mergeEntities = <T extends { name: string }>(
              accArray: T[] = [],
              newArray: T[] = []
            ) => {
              const map = new Map<string, T>();
              [...accArray, ...newArray].forEach((e) => map.set(e.name, e));
              return Array.from(map.values());
            };

            return {
              people: mergeEntities(acc.people, result.entities.people),
              organizations: mergeEntities(
                acc.organizations,
                result.entities.organizations
              ),
              locations: mergeEntities(
                acc.locations,
                result.entities.locations
              ),
              events: mergeEntities(acc.events, result.entities.events),
              topics: mergeEntities(acc.topics, result.entities.topics),
              concepts: mergeEntities(acc.concepts, result.entities.concepts),
            };
          }, {} as ProcessingEntities);

          // Combine analysis from all chunks
          const combinedAnalysis = state.chunks.reduce((acc, chunk) => {
            const result = (chunk as PodcastProcessingChunk).result;
            if (!result?.analysis) return acc;

            // Helper function to merge arrays
            const mergeArrays = <T>(accArray: T[] = [], newArray: T[] = []) => {
              const set = new Set([...accArray, ...newArray]);
              return Array.from(set);
            };

            return {
              summary: acc.summary || result.analysis.summary,
              keyPoints: mergeArrays(acc.keyPoints, result.analysis.keyPoints),
              themes: mergeArrays(acc.themes, result.analysis.themes),
            };
          }, {} as PodcastProcessingAnalysis);

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
            data: {},
          })),
        });

        try {
          const result = await service.processTranscript(content);
          set({ processedTranscript: result.output });
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
        const refinedContent = transcriptStep?.data?.refinedContent as
          | string
          | undefined;

        if (!refinedContent) {
          console.error("No transcript available for retry");
          return;
        }

        set({ isProcessing: true });
        updateStepStatus(stepName, "processing");

        try {
          const result = await service.processTranscript(refinedContent);
          set({ processedTranscript: result.output });
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
