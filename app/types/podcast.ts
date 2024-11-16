export interface ProcessingStep {
  name: string;
  status: "idle" | "processing" | "completed" | "error";
  data: any;
  dependsOn?: string[];
}

export interface ProcessedPodcast {
  id: string;
  summary: string;
  themes: string[];
  keyPoints: string[];
  people: string[];
  organizations: string[];
  locations: string[];
  events: string[];
  timeline: Array<{
    time: string;
    event: string;
    importance: "high" | "medium" | "low";
  }>;
  cleanTranscript: string;
  originalTranscript: string;
}
