"use client";

import { ProcessingPipeline } from "./ProcessingPipeline";
import { usePodcastProcessing } from "@/app/hooks/use-podcast-processing";
import { useEffect, useState } from "react";
import type {
  ValidatedPersonEntity,
  ValidatedOrganizationEntity,
  ValidatedLocationEntity,
  ValidatedEventEntity,
  ValidatedTopicEntity,
  ValidatedConceptEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities";
import type {
  ProcessingStatus,
  TopicAnalysis,
} from "@/app/types/processing/base";
import type {
  PodcastProcessingChunk,
  PodcastProcessingAnalysis,
  ExtendedTheme,
} from "@/app/types/processing/podcast";
import { usePodcastProcessingStore } from "@/app/store/podcastProcessingStore";
import { PROCESSING_STEPS } from "@/app/constants/processing";

type ValidatedEntity =
  | ValidatedPersonEntity
  | ValidatedOrganizationEntity
  | ValidatedLocationEntity
  | ValidatedEventEntity
  | ValidatedTopicEntity
  | ValidatedConceptEntity;

// Use the validated type from entities/index.ts
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
          function mergeEntities<T extends ValidatedEntity>(
            accArray: T[] = [],
            newArray: T[] = []
          ): T[] {
            const map = new Map<string, T>();
            [...accArray, ...newArray].forEach((e) => map.set(e.name, e));
            return Array.from(map.values());
          }

          return {
            people: mergeEntities<ValidatedPersonEntity>(
              acc.people || [],
              chunk.result.entities.people || []
            ),
            organizations: mergeEntities<ValidatedOrganizationEntity>(
              acc.organizations || [],
              chunk.result.entities.organizations || []
            ),
            locations: mergeEntities<ValidatedLocationEntity>(
              acc.locations || [],
              chunk.result.entities.locations || []
            ),
            events: mergeEntities<ValidatedEventEntity>(
              acc.events || [],
              chunk.result.entities.events || []
            ),
            topics: mergeEntities<ValidatedTopicEntity>(
              acc.topics || [],
              chunk.result.entities.topics || []
            ),
            concepts: mergeEntities<ValidatedConceptEntity>(
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

          // Helper function to merge extended themes with deduplication
          function mergeExtendedThemes(
            accThemes: ExtendedTheme[] = [],
            newThemes: ExtendedTheme[] = []
          ): ExtendedTheme[] {
            const map = new Map<string, ExtendedTheme>();
            [...accThemes, ...newThemes].forEach((theme) =>
              map.set(theme.name, theme)
            );
            return Array.from(map.values());
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
            extendedThemes: mergeExtendedThemes(
              acc.extendedThemes || [],
              chunk.result.analysis.extendedThemes || []
            ),
          };
        },
        {
          summary: "",
          keyPoints: [],
          topics: [],
          themes: [],
          extendedThemes: [],
        }
      );

      // Update steps with combined data
      if (Object.keys(combinedEntities).length > 0) {
        updateStepStatus(
          PROCESSING_STEPS.ENTITIES,
          "completed" as ProcessingStatus,
          combinedEntities
        );
      }

      if (Object.keys(combinedAnalysis).length > 0) {
        updateStepStatus(
          PROCESSING_STEPS.ANALYSIS,
          "completed" as ProcessingStatus,
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
