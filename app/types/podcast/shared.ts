export interface Section {
  title: string;
  content: string;
  timestamp?: string;
  speakers?: string[];
}

export interface ContentSection {
  title: string;
  content: string;
  subsections?: ContentSection[];
}

export interface Concept {
  name: string;
  description: string;
  examples: string[];
  relatedConcepts: string[];
}

export interface Argument {
  claim: string;
  evidence: string[];
  counterpoints?: string[];
  resolution?: string;
}

export interface Controversy {
  topic: string;
  perspectives: Array<{
    viewpoint: string;
    arguments: string[];
  }>;
  context: string;
}

export interface Quote {
  text: string;
  speaker: string;
  timestamp?: string;
  context?: string;
}

export interface Application {
  name: string;
  description: string;
  requirements: string[];
  limitations: string[];
}

export interface PodcastInput {
  url: string;
  title?: string;
  description?: string;
  duration?: string;
  publishedAt?: string;
  author?: string;
}

export interface PodcastTranscript {
  text: string;
  speakers: string[];
  timestamps: Array<{
    start: number;
    end: number;
    speaker: string;
  }>;
}

export interface ProcessedPodcast {
  id: string;
  title: string;
  summary: string;
  transcript: string;
  sections: Section[];
  keyPoints: Array<{
    title: string;
    description: string;
  }>;
  people: string[];
  organizations: string[];
  locations: string[];
  events: string[];
  topics: string[];
  concepts: Concept[];
  timeline: Array<{
    timestamp: string;
    event: string;
    speakers?: string[];
  }>;
  metadata: {
    duration: string;
    recordingDate?: string;
    participants: string[];
    mainTopic: string;
    expertise: string;
  };
}
