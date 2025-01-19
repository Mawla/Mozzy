"use client";

import { ProcessingPipeline } from "./ProcessingPipeline";
import { usePodcastProcessing } from "@/app/hooks/use-podcast-processing";
import { useEffect } from "react";
import {
  ValidatedPodcastEntities,
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
} from "@/app/types/entities";
import {
  KeyPoint,
  ProcessingChunk,
  PodcastAnalysis,
} from "@/app/types/podcast/processing";
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
      const combinedEntities = chunks.reduce<ValidatedPodcastEntities>(
        (acc, chunk) => {
          if (!chunk.entities) return acc;

          // Helper function to merge arrays with deduplication
          function mergeEntities<T extends { name: string }>(
            accArray: T[] = [],
            newArray: T[] = []
          ): T[] {
            const map = new Map<string, T>();
            [...accArray, ...newArray].forEach((e) => map.set(e.name, e));
            return Array.from(map.values());
          }

          return {
            people: mergeEntities<PersonEntity>(
              acc.people || [],
              chunk.entities.people || []
            ),
            organizations: mergeEntities<OrganizationEntity>(
              acc.organizations || [],
              chunk.entities.organizations || []
            ),
            locations: mergeEntities<LocationEntity>(
              acc.locations || [],
              chunk.entities.locations || []
            ),
            events: mergeEntities<EventEntity>(
              acc.events || [],
              chunk.entities.events || []
            ),
          };
        },
        {} as ValidatedPodcastEntities
      );

      // Combine analysis from all chunks
      const combinedAnalysis = chunks.reduce<PodcastAnalysis>((acc, chunk) => {
        if (!chunk.analysis) return acc;

        // Helper function to merge arrays
        function mergeArrays<T>(accArray: T[] = [], newArray: T[] = []): T[] {
          const set = new Set([...accArray, ...newArray]);
          return Array.from(set);
        }

        return {
          summary: acc.summary || chunk.analysis.summary,
          keyPoints: mergeArrays(
            acc.keyPoints || [],
            (chunk.analysis.keyPoints as KeyPoint[]) || []
          ),
          themes: mergeArrays(acc.themes || [], chunk.analysis.themes || []),
        };
      }, {} as PodcastAnalysis);

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
