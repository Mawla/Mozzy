import {
  PodcastAnalysis as BasePodcastAnalysis,
  PodcastEntities as BasePodcastEntities,
  Section,
} from "./models";

// Re-export the base types with sections
export interface PodcastAnalysis extends Omit<BasePodcastAnalysis, "sections"> {
  sections?: Section[];
}

// Re-export PodcastEntities type
export type PodcastEntities = BasePodcastEntities;
export type { Section };

// Processing State Types
export interface ProcessingState {
  chunks: ProcessingChunk[];
  networkLogs: NetworkLog[];
  currentTranscript: string;
}

export interface ProcessingChunk {
  id: number;
  text: string;
  status: "pending" | "processing" | "completed" | "error";
  response?: string;
  error?: string;
  analysis?: PodcastAnalysis;
  entities?: PodcastEntities;
  timeline?: TimelineEvent[];
}

export interface NetworkLog {
  timestamp: string;
  type: "request" | "response" | "error";
  message: string;
}

// Analysis Types
export interface QuickFact {
  duration: string;
  participants: string[];
  recordingDate?: string;
  mainTopic: string;
  expertise: string;
}

export interface KeyPoint {
  title: string;
  description: string;
  relevance: string;
}

export interface Theme {
  name: string;
  description: string;
  relatedConcepts: string[];
}

export interface TimelineEvent {
  time: string;
  event: string;
  importance: "high" | "medium" | "low";
}

// Processing Step Types
export interface TextChunk {
  id: number;
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface ChunkOptions {
  maxChunkSize?: number;
  overlap?: number;
  separator?: string;
}

export interface TranscriptStepData {
  refinedContent: string;
  chunks?: ProcessingChunk[];
  networkLogs?: NetworkLog[];
}

export interface AnalysisStepData {
  title?: string;
  summary?: string;
  quickFacts?: QuickFact;
  keyPoints?: KeyPoint[];
  themes?: Theme[];
}

export interface EntityStepData {
  people?: string[];
  organizations?: string[];
  locations?: string[];
  events?: string[];
}

export type StepData = {
  refinedContent?: string;
  chunks?: ProcessingChunk[];
  networkLogs?: NetworkLog[];
  title?: string;
  summary?: string;
  quickFacts?: QuickFact;
  keyPoints?: KeyPoint[];
  themes?: Theme[];
  people?: string[];
  organizations?: string[];
  locations?: string[];
  events?: string[];
  timeline?: TimelineEvent[];
};

export type ProcessingStatus = "idle" | "processing" | "completed" | "error";

export interface ProcessingStep {
  id: string;
  name: string;
  status: ProcessingStatus;
  data: StepData | null;
  error?: Error | string;
}

// Add ChunkResult interface
export interface ChunkResult {
  id: number;
  refinedText: string;
  analysis: PodcastAnalysis;
  entities: PodcastEntities;
  timeline: TimelineEvent[];
}

// Update ProcessingResult to include transcript
export interface ProcessingResult {
  transcript: string;
  refinedTranscript: string;
  analysis: PodcastAnalysis;
  entities: PodcastEntities;
  timeline: TimelineEvent[];
}

// Component Props Types
export interface ChunkVisualizerProps {
  chunks: ProcessingChunk[];
}

export interface NetworkLoggerProps {
  logs: NetworkLog[];
  className?: string;
}

export interface ProcessingPipelineProps {
  steps: ProcessingStep[];
  onRetryStep: (stepName: string) => void;
  isProcessing: boolean;
}

export type ProcessingTab = "progress" | "chunks" | "result" | "logs";

export interface SynthesisResult {
  synthesis: {
    title: string;
    summary: string;
    quickFacts: {
      duration: string;
      participants: string[];
      mainTopics: string[];
      expertise: string;
    };
    keyPoints: Array<{
      title: string;
      description: string;
      relevance: string;
      sourceChunks: number[];
    }>;
    themes: Array<{
      name: string;
      description: string;
      relatedConcepts: string[];
      progression: string;
    }>;
    narrative: {
      beginning: string;
      development: string;
      conclusion: string;
      transitions: string[];
    };
    connections: {
      crossReferences: string[];
      conceptualLinks: string[];
      thematicArcs: string[];
    };
  };
  analysis?: PodcastAnalysis;
}

export interface ContentMetadata {
  duration?: string;
  speakers?: string[];
  mainTopic?: string;
  expertise?: string;
  keyPoints?: Array<{
    title: string;
    description: string;
    relevance: string;
  }>;
  themes?: Array<{
    name: string;
    description: string;
    relatedConcepts: string[];
  }>;
}

// Add a type for the metadata response
export interface MetadataResponse extends ContentMetadata {
  duration: string;
  speakers: string[];
  mainTopic: string;
  expertise: string;
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
}

// Add Entity types for processing
export interface Entity {
  name: string;
  role?: string;
  context?: string;
  timeContext?: string;
  firstMention?: boolean;
}

export interface EntityResponse {
  entities: {
    people: Entity[];
    organizations: Entity[];
    locations: Entity[];
    events: Entity[];
  };
  continuity: {
    referencesPrevious: string[];
    incompleteReferences: string[];
  };
}

// Update Anthropic response types to match the actual API
export interface ContentBlock {
  text: string;
  type: "text";
}

export interface ToolUseBlock {
  type: "tool_use" | "tool_result";
  text: string;
}

export type MessageContentBlock = ContentBlock | ToolUseBlock;

export interface Message {
  id: string;
  content: MessageContentBlock[];
  role: string;
  model: string;
}
