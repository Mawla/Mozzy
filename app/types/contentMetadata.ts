export interface ContentMetadata {
  themes?: string[];
  tags?: string[];
  keyPoints?: string[];
  people?: string[];
  organizations?: string[];
  locations?: string[];
  events?: string[];
  timeline?: Array<{
    time: string;
    event: string;
    importance: "high" | "medium" | "low";
  }>;
}
