import { ContentMetadata } from "@/app/types/contentMetadata";

export interface Podcast {
  id: string;
  title: string;
  summary: string;
  originalTranscript: string;
  cleanTranscript: string;
  duration?: string;
  recordingDate?: string;
  createdAt: string;
  updatedAt: string;
  metadata: ContentMetadata;
  analysis: PodcastAnalysis;
  status: ProcessingStatus;
}

export interface PodcastAnalysis {
  id: string;
  title: string;
  summary: string;
  quickFacts: {
    duration: string;
    participants: string[];
    recordingDate?: string;
    mainTopic: string;
    expertise: string;
  };
  keyPoints: Array<{
    title: string;
    description: string;
    relevance: string;
  }>;
  themes: Array<{
    name: string;
    description: string;
    relatedConcepts: string[];
  }>;
  // ... other analysis fields as defined in the prompt
}

export interface ContentSection {
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

export interface Concept {
  term: string;
  definition: string;
  context: string;
  examples: string[];
}

export interface Argument {
  claim: string;
  evidence: string[];
  counterpoints: string[];
}

export interface Controversy {
  topic: string;
  perspectives: string[];
  resolution: string;
}

export interface Quote {
  text: string;
  speaker: string;
  context: string;
}

export interface Application {
  area: string;
  description: string;
  examples: string[];
  challenges: string[];
}

export interface ProcessingStatus {
  state: "idle" | "processing" | "completed" | "error";
  steps: {
    [key: string]: {
      status: "idle" | "processing" | "completed" | "error";
      completedAt?: string;
      error?: string;
    };
  };
}

export interface ProcessingStep {
  name: string;
  status: "idle" | "processing" | "completed" | "error";
  data: any;
  dependsOn?: string[];
}

export interface PodcastInput {
  type: "url" | "search" | "transcript";
  content: string;
}

export interface ProcessingResult {
  success: boolean;
  podcastId?: string;
  error?: string;
}

export interface PodcastTranscript {
  refinedContent: string;
}

export interface ProcessedPodcast {
  id: string;
  transcript: PodcastTranscript;
  analysis: {
    summary: string;
    keyPoints: string[];
    topics: string[];
    entities: {
      people: string[];
      places: string[];
      organizations: string[];
    };
    timeline: Array<{
      timestamp: string;
      content: string;
    }>;
  };
  status: "processing" | "completed" | "error";
  error?: string;
}

export interface PodcastEntities {
  people: string[];
  organizations: string[];
  locations: string[];
  events: string[];
}

export interface TimelineEvent {
  time: string;
  event: string;
  importance: "high" | "medium" | "low";
}

export interface PodcastProcessingState {
  isProcessing: boolean;
  inputData: PodcastInput | null;
  processingSteps: ProcessingStep[];
  currentPodcast: any | null;
  setProcessing: (isProcessing: boolean) => void;
  setInputData: (data: PodcastInput | null) => void;
  updateStepStatus: (
    stepName: string,
    status: ProcessingStep["status"],
    data?: any
  ) => void;
  processStep: (step: ProcessingStep) => Promise<boolean>;
  handlePodcastSubmit: (data: PodcastInput) => Promise<void>;
  handleRetryStep: (stepName: string) => Promise<void>;
  reset: () => void;
}
