export interface Topic {
  id: string;
  title: string;
  description: string;
  tags: string[];
  relatedTopics?: string[];
  content?: string;
  metadata?: {
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedTime: number;
    prerequisites?: string[];
    [key: string]: any;
  };
}
