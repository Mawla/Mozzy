export interface PodcastAnalysis {
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
  sections: Array<{
    title: string;
    content: string;
    subsections?: Array<{
      title: string;
      content: string;
    }>;
  }>;
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

export interface ProcessingResult {
  transcript: string;
  analysis: PodcastAnalysis;
  entities: PodcastEntities;
  timeline: TimelineEvent[];
}

export interface ProcessingStep {
  name: string;
  status: "idle" | "processing" | "completed" | "error";
  data: any;
  dependsOn?: string[];
}
