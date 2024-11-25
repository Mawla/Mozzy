import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";
import type { PodcastEntity } from "@/app/schemas/podcast/entities";

export interface ViewMetrics {
  label: string;
  value: string | number;
  icon?: string;
}

export interface ViewTopic {
  name: string;
  relevance: "high" | "medium" | "low";
  count: number;
}

export interface ViewReference {
  id: string;
  citation: string;
  url?: string;
  type: "quote" | "link" | "citation";
}

export interface ViewHeading {
  id: string;
  title: string;
  level: number;
}

export const transformPodcastData = (analysis: PodcastAnalysis) => {
  return {
    metrics: transformToMetrics(analysis),
    topics: transformToTopics(analysis),
    references: transformToReferences(analysis),
    headings: transformToHeadings(analysis),
  };
};

const transformToMetrics = (analysis: PodcastAnalysis): ViewMetrics[] => {
  return [
    {
      label: "Key Insights",
      value: analysis.keyPoints.length,
      icon: "✨",
    },
    {
      label: "People Mentioned",
      value: analysis.entities.filter((e) => e.type === "PERSON").length,
      icon: "👥",
    },
    {
      label: "Organizations Discussed",
      value: analysis.entities.filter((e) => e.type === "ORGANIZATION").length,
      icon: "🏢",
    },
    {
      label: "Main Topics",
      value: analysis.topics.length,
      icon: "📚",
    },
  ];
};

const transformToTopics = (analysis: PodcastAnalysis): ViewTopic[] => {
  return analysis.topics.map((topic) => {
    const hasHighMentions = analysis.entities.some(
      (e) =>
        e.context?.toLowerCase().includes(topic.toLowerCase()) && e.count > 5
    );

    return {
      name: topic,
      relevance: hasHighMentions ? "high" : "medium",
      count: analysis.entities.filter((e) =>
        e.context?.toLowerCase().includes(topic.toLowerCase())
      ).length,
    };
  });
};

const transformToReferences = (analysis: PodcastAnalysis): ViewReference[] => {
  return [
    ...analysis.entities
      .filter((e) => e.type === "PERSON" && e.context)
      .map((entity, index) => ({
        id: `person-${index + 1}`,
        citation: `${entity.name} - ${entity.context}`,
        type: "citation" as const,
      })),
    ...analysis.sections.map((section, index) => ({
      id: `insight-${index + 1}`,
      citation: `${section.title} - ${section.content.substring(0, 100)}...`,
      type: "quote" as const,
    })),
  ];
};

const transformToHeadings = (analysis: PodcastAnalysis): ViewHeading[] => {
  return [
    { id: "summary", title: "Executive Summary", level: 2 },
    { id: "key-insights", title: "Key Insights", level: 2 },
    { id: "main-topics", title: "Main Topics", level: 2 },
    { id: "detailed-analysis", title: "Detailed Analysis", level: 2 },
    ...analysis.sections.map((section) => ({
      id: section.title.toLowerCase().replace(/\s+/g, "-"),
      title: section.title,
      level: 3,
    })),
    { id: "key-people", title: "Key People & Organizations", level: 2 },
    { id: "references", title: "References & Citations", level: 2 },
  ];
};

export const getEntityMetrics = (entities: PodcastEntity[]) => {
  return {
    people: entities.filter((e) => e.type === "PERSON").length,
    organizations: entities.filter((e) => e.type === "ORGANIZATION").length,
    locations: entities.filter((e) => e.type === "LOCATION").length,
    events: entities.filter((e) => e.type === "EVENT").length,
  };
};

export const getTopicRelevance = (
  topic: string,
  entities: PodcastEntity[]
): "high" | "medium" | "low" => {
  const mentions = entities.filter((e) =>
    e.context?.toLowerCase().includes(topic.toLowerCase())
  );
  const totalMentions = mentions.reduce((sum, e) => sum + e.count, 0);

  if (totalMentions > 10) return "high";
  if (totalMentions > 5) return "medium";
  return "low";
};
