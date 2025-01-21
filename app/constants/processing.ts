import type { ProcessingStatus } from "@/app/types/processing/base";
import type { PodcastProcessingStep } from "@/app/types/processing/podcast";

export const PROCESSING_STEPS = {
  TRANSCRIPT: "Transcript Refinement",
  ANALYSIS: "Content Analysis",
  ENTITIES: "Entity Extraction",
  TIMELINE: "Timeline Creation",
} as const;

export const INITIAL_STEPS: PodcastProcessingStep[] = [
  {
    id: "transcript",
    name: PROCESSING_STEPS.TRANSCRIPT,
    status: "idle" as ProcessingStatus,
    data: {},
  },
  {
    id: "analysis",
    name: PROCESSING_STEPS.ANALYSIS,
    status: "idle" as ProcessingStatus,
    data: {},
  },
  {
    id: "entities",
    name: PROCESSING_STEPS.ENTITIES,
    status: "idle" as ProcessingStatus,
    data: {},
  },
  {
    id: "timeline",
    name: PROCESSING_STEPS.TIMELINE,
    status: "idle" as ProcessingStatus,
    data: {},
  },
];
