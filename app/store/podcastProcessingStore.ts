import { create } from "zustand";
import { PodcastProcessingService } from "@/app/services/podcastProcessingService";
import {
  ProcessingStep,
  ProcessingResult,
  TranscriptStepData,
  ProcessingChunk,
  NetworkLog,
} from "@/app/types/podcast/processing";
import { convertToTranscriptStepData } from "@/app/utils/stateConverters";
import { processTranscriptLocal } from "@/app/services/podcastProcessingService";

interface PodcastProcessingState {
  isProcessing: boolean;
  processingSteps: ProcessingStep[];
  service: PodcastProcessingService;
  processedTranscript: string | null;
  chunks: ProcessingChunk[];
  networkLogs: NetworkLog[];
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

    service.subscribe((state) => {
      const { updateStepStatus, updateChunks, updateNetworkLogs } = get();

      updateChunks(state.chunks);
      updateNetworkLogs(state.networkLogs);

      updateStepStatus(
        "Transcript Refinement",
        state.chunks.length > 0 ? "processing" : "idle",
        {
          currentTranscript: state.currentTranscript,
        }
      );
    });

    return {
      isProcessing: false,
      processedTranscript: null,
      service,
      chunks: [],
      networkLogs: [],
      processingSteps: [
        { name: "Transcript Refinement", status: "idle", data: null },
        { name: "Content Analysis", status: "idle", data: null },
        { name: "Entity Extraction", status: "idle", data: null },
        { name: "Timeline Creation", status: "idle", data: null },
      ],

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
          const { refinedTranscript } = await service.refineTranscript(content);

          set({ processedTranscript: refinedTranscript });

          // Continue with other processing steps...
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

        try {
          switch (stepName) {
            case "Content Analysis":
              const analysis = await service.analyzeContent(refinedContent);
              updateStepStatus(stepName, "completed", analysis);
              break;
            case "Entity Extraction":
              const entities = await service.extractEntities(refinedContent);
              updateStepStatus(stepName, "completed", entities);
              break;
            case "Timeline Creation":
              const timeline = await service.createTimeline(refinedContent);
              updateStepStatus(stepName, "completed", timeline);
              break;
            default:
              console.warn(`Retry not implemented for step: ${stepName}`);
          }
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
