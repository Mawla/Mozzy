import {
  Theme,
  QA,
  Section,
  ContentAnalysis,
} from "@/app/schemas/podcast/analysis";
import { TopicItem } from "./topic";

export interface TimelineEvent {
  title: string;
  description: string;
  date: string;
  type: "milestone" | "event" | "decision";
  importance: "high" | "medium" | "low";
}

export interface MetricData {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export interface ProcessedPodcast extends Omit<ContentAnalysis, "themes"> {
  id: string;
  people: string[];
  organizations: string[];
  locations: string[];
  events: string[];
  timeline: TimelineEvent[];
  themes: Theme[];
  topics: TopicItem[];
  metrics: MetricData[];
  quickFacts: {
    duration?: string;
    participants: string[];
    mainTopic: string;
    expertise: string;
  };
}

export interface ProcessingStep {
  name: string;
  status: "idle" | "processing" | "completed" | "error";
  data: any;
  dependsOn?: string[];
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  duration?: string;
  status: "processing" | "completed" | "error";
  analysis?: ProcessedPodcast;
}
