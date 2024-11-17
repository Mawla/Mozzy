import {
  ProcessingStep,
  ProcessingStatus,
} from "@/app/types/podcast/processing";

export const PROCESSING_STEPS = {
  TRANSCRIPT: "Transcript Refinement",
  ANALYSIS: "Content Analysis",
  ENTITIES: "Entity Extraction",
  TIMELINE: "Timeline Creation",
} as const;

export const INITIAL_STEPS: ProcessingStep[] = [
  {
    name: PROCESSING_STEPS.TRANSCRIPT,
    status: "idle" as ProcessingStatus,
    data: null,
  },
  {
    name: PROCESSING_STEPS.ANALYSIS,
    status: "idle" as ProcessingStatus,
    data: null,
  },
  {
    name: PROCESSING_STEPS.ENTITIES,
    status: "idle" as ProcessingStatus,
    data: null,
  },
  {
    name: PROCESSING_STEPS.TIMELINE,
    status: "idle" as ProcessingStatus,
    data: null,
  },
];
