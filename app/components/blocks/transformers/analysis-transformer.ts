import { PodcastAnalysis, Theme } from "../types";
import { BlockRow, BlockConfig } from "../block-builder";

export function transformQuickFacts(analysis: PodcastAnalysis): BlockRow {
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
                type: "grid",
                label: "Duration",
                value: [
                  { label: "Duration", value: analysis.quickFacts.duration },
                ],
              },
              {
                type: "list",
                label: "Participants",
                value: analysis.quickFacts.participants,
              },
              {
                type: "text",
                label: "Main Topic",
                value: analysis.quickFacts.mainTopic,
              },
              {
                type: "text",
                label: "Expertise",
                value: analysis.quickFacts.expertise,
              },
            ],
          },
        ],
      },
    ],
  };
}

export function transformSummary(analysis: PodcastAnalysis): BlockRow {
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
                value: analysis.summary,
              },
            ],
          },
        ],
      },
    ],
  };
}

export function transformKeyPoints(analysis: PodcastAnalysis): BlockRow {
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
                value: analysis.keyPoints,
              },
            ],
          },
        ],
      },
    ],
  };
}

function transformTheme(theme: Theme, index: number) {
  return {
    type: "grid",
    label: theme.name,
    value: [
      {
        description: theme.description,
        concepts: theme.relatedConcepts,
      },
    ],
  };
}

export function transformThemes(analysis: PodcastAnalysis): BlockRow {
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

export function transformAnalysisToBlocks(
  analysis: PodcastAnalysis
): BlockRow[] {
  const rows: BlockRow[] = [];

  if (analysis.quickFacts) {
    rows.push(transformQuickFacts(analysis));
  }

  if (analysis.summary) {
    rows.push(transformSummary(analysis));
  }

  if (analysis.keyPoints?.length > 0) {
    rows.push(transformKeyPoints(analysis));
  }

  if (analysis.themes?.length > 0) {
    rows.push(transformThemes(analysis));
  }

  return rows;
}
