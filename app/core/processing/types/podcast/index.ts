import type {
  BaseProcessingResult,
  ProcessingOptions,
  ProcessingAnalysis,
  TimelineEvent,
  BaseTextChunk,
  ProcessingStatus,
} from "../base";

import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
} from "@/app/schemas/podcast/entities";

export interface PodcastProcessingOptions extends ProcessingOptions {
  extractSpeakers: boolean;
  generateTimeline: boolean;
  speakerDiarization: boolean;
  transcriptionQuality: "standard" | "premium";
}

export interface PodcastTextChunk extends BaseTextChunk {
  speaker?: string;
  confidence?: number;
  sentiment?: number;
  topics?: string[];
}

export interface PodcastAnalysis extends ProcessingAnalysis {
  speakers: Array<{
    name: string;
    speakingTime: number;
    segments: Array<{
      start: number;
      end: number;
      text: string;
    }>;
  }>;
  episodeHighlights: Array<{
    timestamp: string;
    text: string;
    speaker?: string;
    topics?: string[];
  }>;
}

export interface PodcastProcessingResult extends BaseProcessingResult {
  format: "podcast";
  analysis: PodcastAnalysis;
  chunks: PodcastTextChunk[];
  speakers: string[];
  timeline: TimelineEvent[];
  entities: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  status: ProcessingStatus;
}
