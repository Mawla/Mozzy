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

export interface TopicItem {
  id: string;
  title: string;
  content: string;
  subtopics?: TopicItem[];
  metadata?: {
    timestamp?: string;
    relevanceScore?: number;
    relatedTopics?: string[];
    [key: string]: any;
  };
}

export interface TopicBlockProps {
  title: string;
  description?: string;
  topics: TopicItem[];
}
