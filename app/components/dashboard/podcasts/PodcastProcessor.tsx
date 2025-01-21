"use client";

import { ProcessingPipeline } from "./ProcessingPipeline";
import { usePodcastProcessing } from "@/app/hooks/use-podcast-processing";
import { useEffect, useState } from "react";
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities/podcast";
import type {
  ProcessingStatus,
  TopicAnalysis,
} from "@/app/types/processing/base";
import type {
  PodcastProcessingChunk,
  PodcastProcessingAnalysis,
} from "@/app/types/processing/podcast";
import { usePodcastProcessingStore } from "@/app/store/podcastProcessingStore";
import { PROCESSING_STEPS } from "@/app/constants/processing";

type PodcastEntity =
  | PersonEntity
  | OrganizationEntity
  | LocationEntity
  | EventEntity
  | TopicEntity
  | ConceptEntity;

// Use the validated type from podcast.ts
type ValidatedEntities = ValidatedPodcastEntities;

export const PodcastProcessor = () => {
  const { isProcessing, processingSteps, handleRetryStep, chunks } =
    usePodcastProcessing();
  const [isOpen, setIsOpen] = useState(true);

  const updateStepStatus = usePodcastProcessingStore(
    (state) => state.updateStepStatus
  );

  useEffect(() => {
    if (!chunks.length) return;

    const allChunksCompleted = chunks.every(
      (chunk: PodcastProcessingChunk) => chunk.status === "completed"
    );

    if (allChunksCompleted) {
      // Combine entities from all chunks with type safety
      const combinedEntities = chunks.reduce<ValidatedEntities>(
        (acc, chunk) => {
          if (!chunk.result?.entities) return acc;

          // Helper function to merge arrays with deduplication and type safety
          function mergeEntities<T extends PodcastEntity>(
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
              chunk.result.entities.people || []
            ),
            organizations: mergeEntities<OrganizationEntity>(
              acc.organizations || [],
              chunk.result.entities.organizations || []
            ),
            locations: mergeEntities<LocationEntity>(
              acc.locations || [],
              chunk.result.entities.locations || []
            ),
            events: mergeEntities<EventEntity>(
              acc.events || [],
              chunk.result.entities.events || []
            ),
            topics: mergeEntities<TopicEntity>(
              acc.topics || [],
              chunk.result.entities.topics || []
            ),
            concepts: mergeEntities<ConceptEntity>(
              acc.concepts || [],
              chunk.result.entities.concepts || []
            ),
          };
        },
        {
          people: [],
          organizations: [],
          locations: [],
          events: [],
          topics: [],
          concepts: [],
        }
      );

      // Combine analysis from all chunks with proper type safety
      const combinedAnalysis = chunks.reduce<PodcastProcessingAnalysis>(
        (acc, chunk) => {
          if (!chunk.result?.analysis) return acc;

          // Helper function to merge arrays with type safety
          function mergeArrays<T>(accArray: T[] = [], newArray: T[] = []): T[] {
            const set = new Set([...accArray, ...newArray]);
            return Array.from(set);
          }

          return {
            summary: acc.summary || chunk.result.analysis.summary || "",
            keyPoints: mergeArrays(
              acc.keyPoints || [],
              chunk.result.analysis.keyPoints || []
            ),
            topics: mergeArrays<TopicAnalysis>(
              acc.topics || [],
              chunk.result.analysis.topics || []
            ),
            themes: mergeArrays(
              acc.themes || [],
              chunk.result.analysis.themes || []
            ),
          };
        },
        {
          summary: "",
          keyPoints: [],
          topics: [],
          themes: [],
        }
      );

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
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    />
  );
};
