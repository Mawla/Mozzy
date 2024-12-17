// Topic metadata information
export interface TopicMetadata {
  timestamp?: string;
  relevanceScore?: number;
  references?: string[];
  relatedTopics?: string[];
}

// Individual topic item with hierarchical structure
export interface TopicItem {
  id: string;
  title: string;
  content: string;
  metadata?: TopicMetadata;
  subtopics?: TopicItem[];
}

// Props for the TopicBlock component
export interface TopicBlockProps {
  title: string;
  description?: string;
  topics: TopicItem[];
}

// Topic-specific view field metadata
export interface TopicViewMetadata {
  showTimestamps?: boolean;
  showRelevanceScores?: boolean;
  showRelatedTopics?: boolean;
  expandedByDefault?: boolean;
  maxDepth?: number;
  collapsible?: boolean;
}
