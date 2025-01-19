export interface ChunkResult {
  id: string;
  text: string;
  analysis?: ProcessingAnalysis;
}

export interface PodcastAnalysis extends ProcessingAnalysis {
  quickFacts?: {
    duration?: string;
    speakers?: string[];
  };
}

export interface PodcastEntities {
  people?: string[];
  organizations?: string[];
  locations?: string[];
  dates?: string[];
  topics?: string[];
}

export interface ContentMetadata {
  format: ProcessingFormat;
  platform: string;
  processedAt: string;
}

export interface MetadataResponse {
  metadata: ContentMetadata;
  analysis?: ProcessingAnalysis;
  entities?: PodcastEntities;
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  error?: string;
  dependencies?: string[];
  result?: any;
}
