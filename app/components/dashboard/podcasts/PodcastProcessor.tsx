"use client";

import { ProcessingPipeline } from "./ProcessingPipeline";
import { usePodcastProcessing } from "@/app/hooks/use-podcast-processing";
import { useEffect } from "react";
import { PodcastEntities } from "@/app/schemas/podcast/entities";
import { KeyPoint, Theme } from "@/app/types/podcast/processing";
import { usePodcastProcessingStore } from "@/app/store/podcastProcessingStore";
import { PROCESSING_STEPS } from "@/app/constants/processing";

export const PodcastProcessor = () => {
  const { isProcessing, processingSteps, handleRetryStep, chunks } =
    usePodcastProcessing();

  const updateStepStatus = usePodcastProcessingStore(
    (state) => state.updateStepStatus
  );

  useEffect(() => {
    if (!chunks.length) return;

    const allChunksCompleted = chunks.every(
      (chunk) => chunk.status === "completed"
    );

    if (allChunksCompleted) {
      // Combine entities from all chunks
      const combinedEntities = chunks.reduce((acc, chunk) => {
        if (!chunk.entities) return acc;

        // Helper function to merge arrays with deduplication
        const mergeEntities = (accArray: any[] = [], newArray: any[] = []) => {
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
      const combinedAnalysis = chunks.reduce((acc, chunk) => {
        if (!chunk.analysis) return acc;

        // Helper function to merge arrays
        const mergeArrays = (accArray: any[] = [], newArray: any[] = []) => {
          const set = new Set([...accArray, ...newArray]);
          return Array.from(set);
        };

        return {
          summary: acc.summary || chunk.analysis.summary,
          keyPoints: mergeArrays(acc.keyPoints, chunk.analysis.keyPoints),
          themes: mergeArrays(acc.themes, chunk.analysis.themes),
        };
      }, {} as { summary?: string; keyPoints?: KeyPoint[]; themes?: Theme[] });

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
    }
  }, [chunks, updateStepStatus]);

  return (
    <ProcessingPipeline
      steps={processingSteps || []}
      onRetryStep={handleRetryStep}
      isProcessing={isProcessing}
      isOpen={true}
      onToggle={() => {}}
    />
  );
};
