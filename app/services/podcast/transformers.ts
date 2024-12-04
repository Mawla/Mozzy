import { Podcast, ProcessedPodcast } from "@/app/types/podcast";

interface PodcastMetric {
  label: string;
  value: number;
  icon: string;
}

export function transformPodcastData(
  podcast: Podcast,
  analysis?: ProcessedPodcast
) {
  return {
    ...podcast,
    metrics: transformToMetrics(analysis),
  };
}

export function transformToMetrics(
  analysis?: ProcessedPodcast
): PodcastMetric[] {
  const metrics: PodcastMetric[] = [
    {
      label: "Key Insights",
      value: analysis?.keyPoints?.length || 0,
      icon: "✨",
    },
    {
      label: "People Mentioned",
      value: analysis?.people?.length || 0,
      icon: "👥",
    },
    {
      label: "Organizations",
      value: analysis?.organizations?.length || 0,
      icon: "🏢",
    },
    {
      label: "Locations",
      value: analysis?.locations?.length || 0,
      icon: "📍",
    },
    {
      label: "Events",
      value: analysis?.events?.length || 0,
      icon: "📅",
    },
    {
      label: "Timeline Points",
      value: analysis?.timeline?.length || 0,
      icon: "⏱️",
    },
  ];

  return metrics;
}
