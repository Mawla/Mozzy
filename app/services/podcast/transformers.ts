import { Podcast, ProcessedPodcast } from "@/app/types/podcast";
import { BlockRow, BlockConfig } from "@/app/components/blocks/block-builder";
import { ViewField } from "@/app/components/blocks/base-block";

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
    blocks: transformToBlocks(analysis),
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

function transformQuickFacts(analysis: ProcessedPodcast): BlockRow {
  // TODO: Implement proper quick facts transformation
  return {
    id: "quick-facts",
    blocks: [
      {
        id: "quick-facts-block",
        layout: "full",
        sections: [
          {
            title: "Quick Facts",
            fields: [
              {
                type: "text",
                label: "Raw Data",
                value: JSON.stringify(analysis, null, 2),
              },
            ],
          },
        ],
      },
    ],
  };
}

function transformSummary(analysis: ProcessedPodcast): BlockRow {
  return {
    id: "summary",
    blocks: [
      {
        id: "summary-block",
        layout: "full",
        sections: [
          {
            title: "Summary",
            fields: [
              {
                type: "text",
                label: "Overview",
                value: analysis.summary || "No summary available",
              },
            ],
          },
        ],
      },
    ],
  };
}

function transformKeyPoints(analysis: ProcessedPodcast): BlockRow {
  return {
    id: "key-points",
    blocks: [
      {
        id: "key-points-block",
        layout: "full",
        sections: [
          {
            title: "Key Points",
            fields: [
              {
                type: "list",
                label: "Main Takeaways",
                value: analysis.keyPoints || [],
              },
            ],
          },
        ],
      },
    ],
  };
}

function transformThemes(analysis: ProcessedPodcast): BlockRow {
  // TODO: Implement proper theme transformation with grid layout
  return {
    id: "themes",
    blocks: [
      {
        id: "themes-block",
        layout: "full",
        sections: [
          {
            title: "Themes",
            fields: [
              {
                type: "text",
                label: "Raw Theme Data",
                value: JSON.stringify(analysis.themes, null, 2),
              },
            ],
          },
        ],
      },
    ],
  };
}

function transformMetrics(analysis: ProcessedPodcast): BlockRow {
  // TODO: Implement proper metrics visualization
  return {
    id: "metrics",
    blocks: [
      {
        id: "metrics-block",
        layout: "full",
        sections: [
          {
            title: "Analysis Metrics",
            fields: [
              {
                type: "text",
                label: "Content Analysis",
                value: JSON.stringify(transformToMetrics(analysis), null, 2),
              },
            ],
          },
        ],
      },
    ],
  };
}

export function transformToBlocks(analysis?: ProcessedPodcast): BlockRow[] {
  if (!analysis) return [];

  const rows: BlockRow[] = [];

  // Add metrics at the top
  rows.push(transformMetrics(analysis));

  // Add quick facts
  rows.push(transformQuickFacts(analysis));

  // Add summary if available
  if (analysis.summary) {
    rows.push(transformSummary(analysis));
  }

  // Add key points if available
  if (analysis.keyPoints?.length > 0) {
    rows.push(transformKeyPoints(analysis));
  }

  // Add themes if available
  if (analysis.themes?.length > 0) {
    rows.push(transformThemes(analysis));
  }

  return rows;
}
