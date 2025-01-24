import type { ProcessingStatus } from "@/app/types/processing/base";
import type { PodcastProcessingStep } from "@/app/types/processing/podcast";
import { ProcessingStatus as ProcessingStatusConstants } from "@/app/types/processing/constants";

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
    progress: 0,
    data: {},
  },
  {
    id: "analysis",
    name: PROCESSING_STEPS.ANALYSIS,
    status: "idle" as ProcessingStatus,
    progress: 0,
    data: {},
  },
  {
    id: "entities",
    name: PROCESSING_STEPS.ENTITIES,
    status: "idle" as ProcessingStatus,
    progress: 0,
    data: {},
  },
  {
    id: "timeline",
    name: PROCESSING_STEPS.TIMELINE,
    status: "idle" as ProcessingStatus,
    progress: 0,
    data: {},
  },
];

export const PODCAST_PROCESSING_STEPS = [
  {
    id: "transcript",
    name: "Transcription",
    status: ProcessingStatusConstants.IDLE,
    progress: 0,
    data: {},
  },
  {
    id: "analysis",
    name: "Content Analysis",
    status: ProcessingStatusConstants.IDLE,
    progress: 0,
    data: {},
  },
  {
    id: "entities",
    name: "Entity Extraction",
    status: ProcessingStatusConstants.IDLE,
    progress: 0,
    data: {},
  },
  {
    id: "timeline",
    name: "Timeline Creation",
    status: ProcessingStatusConstants.IDLE,
    progress: 0,
    data: {},
  },
] as const;
