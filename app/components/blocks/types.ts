// Analysis Data Types
export interface QuickFacts {
  duration: string;
  participants: string[];
  mainTopic: string;
  expertise: string;
}

export interface Theme {
  name: string;
  description: string;
  relatedConcepts: string[];
}

export interface PodcastAnalysis {
  quickFacts: QuickFacts;
  summary: string;
  keyPoints: string[];
  themes: Theme[];
  timeline?: TimelineEvent[];
  metrics?: MetricData[];
}

export interface TimelineEvent {
  title: string;
  description: string;
  date: string;
  type: "milestone" | "decision" | "event";
  importance: "high" | "medium" | "low";
}

export interface MetricData {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

// Block System Types
export interface BlockField {
  type:
    | "number"
    | "text"
    | "badge"
    | "list"
    | "grid"
    | "comparison"
    | "timeline"
    | "metrics";
  label: string;
  value: any;
  metadata?: {
    layout?: "default" | "metric" | "timeline";
    iconPosition?: "left" | "right" | "top";
  };
}

export interface BlockSection {
  title: string;
  description?: string;
  fields: BlockField[];
}
