import { ProcessedPodcast, Podcast } from "@/app/types/podcast";
import {
  ViewField,
  FieldMetadata,
  SectionMetadata,
} from "@/app/types/metadata";
import { BlockRow, BlockConfig } from "@/app/types/blocks";

export function transformToBlocks(analysis?: ProcessedPodcast): BlockRow[] {
  if (!analysis) return [];

  return [
    transformQuickFacts(analysis),
    transformMetrics(analysis),
    transformKeyPoints(analysis),
    transformTopics(analysis),
    transformThemes(analysis),
  ];
}

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
  const metadata: FieldMetadata = {
    layout: "grid",
    columns: 1,
    gap: 4,
    variant: "bordered",
    interactive: true,
  };

  return {
    type: "grid",
    label: theme.name,
    value: [
      {
        description: theme.description,
        concepts: theme.relatedConcepts,
      },
    ],
    metadata,
  };
}

function transformQuickFacts(analysis: ProcessedPodcast): BlockRow {
  const fields: ViewField[] = [
    ...(analysis.quickFacts.duration
      ? [
          {
            type: "text",
            label: "Duration",
            value: analysis.quickFacts.duration,
            metadata: {
              variant: "compact",
              iconPosition: "left",
            },
          } as ViewField,
        ]
      : []),
    {
      type: "list",
      label: "Participants",
      value: analysis.quickFacts.participants,
      metadata: {
        renderAs: "grid",
        columns: 1,
        gap: 2,
        interactive: true,
        maxItems: 5,
        showMore: true,
      },
    } as ViewField,
    {
      type: "text",
      label: "Main Topic",
      value: analysis.quickFacts.mainTopic,
      metadata: {
        variant: "compact",
        iconPosition: "left",
      },
    } as ViewField,
    {
      type: "text",
      label: "Expertise Level",
      value: analysis.quickFacts.expertise,
      metadata: {
        variant: "compact",
        iconPosition: "left",
      },
    } as ViewField,
  ];

  const sectionMetadata: SectionMetadata = {
    noCard: true,
    spacing: "sm",
    padding: "sm",
    titleSize: "sm",
    showDescription: false,
  };

  const block: BlockConfig = {
    id: "quick-facts-block",
    layout: "full",
    sections: [
      {
        title: "Quick Facts",
        fields,
        metadata: sectionMetadata,
      },
    ],
    metadata: {
      placement: "sidebar",
    },
  };

  return {
    id: "quick-facts",
    blocks: [block],
  };
}

function transformKeyPoints(analysis: ProcessedPodcast): BlockRow {
  const fieldMetadata: FieldMetadata = {
    renderAs: "cards",
    gap: 4,
    interactive: true,
    maxItems: 10,
    showMore: true,
  };

  const sectionMetadata: SectionMetadata = {
    variant: "bordered",
    spacing: "md",
    padding: "md",
    shadow: true,
    rounded: true,
    background: true,
  };

  const block: BlockConfig = {
    id: "key-points-block",
    layout: "full",
    sections: [
      {
        title: "Key Points",
        fields: [
          {
            type: "list",
            label: "Main Takeaways",
            value: analysis.keyPoints,
            metadata: fieldMetadata,
          } as ViewField,
        ],
        metadata: sectionMetadata,
      },
    ],
  };

  return {
    id: "key-points",
    blocks: [block],
  };
}

function transformMetrics(analysis: ProcessedPodcast): BlockRow {
  const fieldMetadata: FieldMetadata = {
    layout: "metric",
    iconPosition: "left",
    variant: "compact",
  };

  const sectionMetadata: SectionMetadata = {
    noCard: true,
    spacing: "sm",
    padding: "sm",
    titleSize: "sm",
    showDescription: false,
  };

  const block: BlockConfig = {
    id: "metrics-block",
    layout: "full",
    sections: [
      {
        title: "Key Metrics",
        fields: analysis.metrics.map(
          (metric) =>
            ({
              type: "number",
              label: metric.label,
              value: metric.value,
              metadata: fieldMetadata,
            } as ViewField)
        ),
        metadata: sectionMetadata,
      },
    ],
    metadata: {
      placement: "sidebar",
    },
  };

  return {
    id: "metrics",
    blocks: [block],
  };
}

function transformThemes(analysis: ProcessedPodcast): BlockRow {
  const midPoint = Math.ceil(analysis.themes.length / 2);
  const firstHalf = analysis.themes.slice(0, midPoint);
  const secondHalf = analysis.themes.slice(midPoint);

  const sectionMetadata: SectionMetadata = {
    variant: "bordered",
    spacing: "md",
    padding: "md",
    shadow: true,
    rounded: true,
    background: true,
  };

  const blocks: BlockConfig[] = [];

  if (firstHalf.length > 0) {
    blocks.push({
      id: "themes-block-1",
      layout: "half",
      sections: [
        {
          title: "Key Themes",
          fields: firstHalf.map((theme, index) => transformTheme(theme, index)),
          metadata: sectionMetadata,
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
          metadata: sectionMetadata,
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
  const fieldMetadata: FieldMetadata = {
    layout: "timeline",
    interactive: true,
    timeline: {
      description: "Timeline of key events and milestones",
    },
  };

  const sectionMetadata: SectionMetadata = {
    variant: "bordered",
    spacing: "lg",
    padding: "lg",
    shadow: true,
    rounded: true,
    background: true,
  };

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
                type: "timeline",
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
                metadata: fieldMetadata,
              } as ViewField,
            ],
            metadata: sectionMetadata,
          },
        ],
      },
    ],
  };
}

function transformSections(analysis: ProcessedPodcast): BlockRow {
  const contentFieldMetadata: FieldMetadata = {
    variant: "expanded",
  };

  const qaFieldMetadata: FieldMetadata = {
    layout: "grid",
    columns: 1,
    gap: 4,
    interactive: true,
  };

  const sectionMetadata: SectionMetadata = {
    variant: "bordered",
    spacing: "md",
    padding: "md",
    shadow: true,
    rounded: true,
    background: true,
    isCollapsible: true,
    defaultCollapsed: false,
  };

  return {
    id: "sections",
    blocks: [
      {
        id: "sections-block",
        layout: "full",
        sections: analysis.sections.map((section) => ({
          title: section.title,
          fields: [
            {
              type: "text",
              label: "Content",
              value: section.content,
              metadata: contentFieldMetadata,
            } as ViewField,
            ...(section.qa
              ? [
                  {
                    type: "grid",
                    label: "Q&A",
                    value: section.qa.map((qa) => ({
                      question: qa.question,
                      answer: qa.answer,
                      context: qa.context,
                      topics: qa.topics,
                    })),
                    metadata: qaFieldMetadata,
                  } as ViewField,
                ]
              : []),
          ],
          metadata: sectionMetadata,
        })),
      },
    ],
  };
}

function transformTopics(analysis: ProcessedPodcast): BlockRow {
  const sectionMetadata: SectionMetadata = {
    variant: "bordered",
    spacing: "md",
    padding: "md",
    shadow: true,
    rounded: true,
    background: true,
  };

  const block: BlockConfig = {
    id: "topics-block",
    layout: "full",
    sections: [
      {
        title: "Main Topics",
        fields: [
          {
            type: "custom",
            label: "Topics",
            value: analysis.topics,
            metadata: {
              component: "TopicBlock",
              props: {
                title: "Topics Discussed",
                description: "Key topics and subtopics covered in this podcast",
                topics: analysis.topics,
              },
            },
          },
        ],
        metadata: sectionMetadata,
      },
    ],
  };

  return {
    id: "topics",
    blocks: [block],
  };
}
