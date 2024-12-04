import { ProcessedPodcast, Podcast } from "@/app/types/podcast";
import { BlockRow, BlockConfig } from "@/app/components/blocks/block-builder";
import { ViewField } from "@/app/components/blocks/base-block";

export function transformPodcastData(
  podcast: Podcast,
  analysis?: ProcessedPodcast
) {
  // Transform podcast data for display
  return {
    title: podcast.title,
    duration: podcast.duration,
    analysis: analysis || null,
  };
}

function transformTheme(
  theme: { name: string; description: string; relatedConcepts: string[] },
  index: number
): ViewField {
  return {
    type: "grid" as const,
    label: theme.name,
    value: [
      {
        description: theme.description,
        concepts: theme.relatedConcepts,
      },
    ],
  };
}

function transformQuickFacts(analysis: ProcessedPodcast): BlockRow {
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
                type: "text" as const,
                label: "Duration",
                value: analysis.quickFacts.duration,
              },
              {
                type: "list" as const,
                label: "Participants",
                value: analysis.quickFacts.participants,
              },
              {
                type: "text" as const,
                label: "Main Topic",
                value: analysis.quickFacts.mainTopic,
              },
              {
                type: "text" as const,
                label: "Expertise Level",
                value: analysis.quickFacts.expertise,
              },
            ],
          },
        ],
      },
    ],
  };
}

function transformMetrics(analysis: ProcessedPodcast): BlockRow {
  return {
    id: "metrics",
    blocks: [
      {
        id: "metrics-block",
        layout: "full",
        sections: [
          {
            title: "Key Metrics",
            fields: analysis.metrics.map((metric) => ({
              type: "number" as const,
              label: metric.label,
              value: metric.value,
            })),
          },
        ],
      },
    ],
  };
}

function transformThemes(analysis: ProcessedPodcast): BlockRow {
  const midPoint = Math.ceil(analysis.themes.length / 2);
  const firstHalf = analysis.themes.slice(0, midPoint);
  const secondHalf = analysis.themes.slice(midPoint);

  const blocks: BlockConfig[] = [];

  if (firstHalf.length > 0) {
    blocks.push({
      id: "themes-block-1",
      layout: "half",
      sections: [
        {
          title: "Key Themes",
          fields: firstHalf.map((theme, index) => transformTheme(theme, index)),
        },
      ],
    });
  }

  if (secondHalf.length > 0) {
    blocks.push({
      id: "themes-block-2",
      layout: "half",
      sections: [
        {
          title: "Additional Themes",
          fields: secondHalf.map((theme, index) =>
            transformTheme(theme, index + midPoint)
          ),
        },
      ],
    });
  }

  return {
    id: "themes",
    blocks,
  };
}

function transformTimeline(analysis: ProcessedPodcast): BlockRow {
  return {
    id: "timeline",
    blocks: [
      {
        id: "timeline-block",
        layout: "full",
        sections: [
          {
            title: "Timeline",
            fields: [
              {
                type: "timeline" as const,
                label: "Event Timeline",
                value: analysis.timeline.map((event) => ({
                  title: event.title,
                  description: event.description,
                  date: event.date,
                  type:
                    event.type === "milestone"
                      ? "milestone"
                      : event.type === "decision"
                      ? "decision"
                      : "event",
                  importance: event.importance,
                })),
              },
            ],
          },
        ],
      },
    ],
  };
}

export function transformToBlocks(analysis: ProcessedPodcast): BlockRow[] {
  const rows: BlockRow[] = [];

  // Add quick facts to the sidebar
  if (analysis.quickFacts) {
    rows.push(transformQuickFacts(analysis));
  }

  // Add metrics to the sidebar
  if (analysis.metrics?.length > 0) {
    rows.push(transformMetrics(analysis));
  }

  // Add main content blocks
  if (analysis.themes?.length > 0) {
    rows.push(transformThemes(analysis));
  }

  if (analysis.timeline?.length > 0) {
    rows.push(transformTimeline(analysis));
  }

  return rows;
}
