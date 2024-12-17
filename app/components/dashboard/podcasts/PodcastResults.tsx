"use client";

import * as React from "react";
import { Podcast, ProcessedPodcast } from "@/app/types/podcast";
import { BlockBuilder } from "@/app/components/blocks";
import { transformToBlocks } from "@/app/services/podcast/transformers";
import { Button } from "@/components/ui/button";
import { Clock, Download, Share2 } from "lucide-react";
import { WikiLayout } from "@/app/components/wiki/layout";
import { WikiNavigation } from "@/app/components/wiki/navigation";
import { WikiSidebar } from "@/app/components/wiki/sidebar";
import { WikiMainContent } from "@/app/components/wiki/main-content";
import { WikiSection } from "@/app/components/wiki/section";

interface PodcastResultsProps {
  podcast?: Podcast;
  analysis?: ProcessedPodcast;
}

export function PodcastResults({ podcast, analysis }: PodcastResultsProps) {
  const blocks = React.useMemo(() => transformToBlocks(analysis), [analysis]);

  if (!podcast) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">
          No podcast data available
        </p>
      </div>
    );
  }

  const navigationSections = [
    {
      id: "main",
      title: "Main Sections",
      items: [
        { id: "insights", title: "Key Insights" },
        { id: "themes", title: "Themes" },
        { id: "timeline", title: "Timeline" },
        { id: "qa", title: "Q&A" },
      ].filter((item) => {
        // Only show navigation items for sections that have data
        switch (item.id) {
          case "insights":
            return blocks?.some((row) => row.id === "key-points");
          case "themes":
            return blocks?.some((row) => row.id === "themes");
          case "timeline":
            return blocks?.some((row) => row.id === "timeline");
          case "qa":
            return blocks?.some((row) => row.id === "qa");
          default:
            return false;
        }
      }),
    },
  ];

  const quickFactsBlocks =
    blocks?.filter((row) => row.id === "quick-facts") ?? [];
  const metricsBlocks = blocks?.filter((row) => row.id === "metrics") ?? [];
  const keyPointsBlocks =
    blocks?.filter((row) => row.id === "key-points") ?? [];
  const themesBlocks = blocks?.filter((row) => row.id === "themes") ?? [];
  const timelineBlocks = blocks?.filter((row) => row.id === "timeline") ?? [];
  const qaBlocks = blocks?.filter((row) => row.id === "qa") ?? [];

  const sidebarSections = [
    ...(quickFactsBlocks.length > 0
      ? [
          {
            id: "quick-facts",
            title: "Quick Facts",
            content: <BlockBuilder rows={quickFactsBlocks} />,
          },
        ]
      : []),
    ...(metricsBlocks.length > 0
      ? [
          {
            id: "metrics",
            title: "Metrics",
            content: <BlockBuilder rows={metricsBlocks} />,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col min-h-0 flex-1 bg-background">
      {/* Header */}
      <div className="flex-none border-b border-border bg-card">
        <div className="flex items-center justify-between h-[60px] px-6">
          <div>
            <h1 className="text-2xl font-bold">{podcast.title}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{podcast.duration || analysis?.quickFacts?.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Wiki Layout */}
      <WikiLayout
        navigation={<WikiNavigation sections={navigationSections} />}
        sidebar={<WikiSidebar sections={sidebarSections} />}
        defaultNavigationWidth={160}
        defaultSidebarWidth={320}
      >
        <WikiMainContent>
          {/* Key Insights Section */}
          {keyPointsBlocks.length > 0 && (
            <WikiSection id="insights" className="mt-6">
              <BlockBuilder rows={keyPointsBlocks} />
            </WikiSection>
          )}

          {/* Themes Section */}
          {themesBlocks.length > 0 && (
            <WikiSection id="themes" level={3}>
              <BlockBuilder rows={themesBlocks} />
            </WikiSection>
          )}

          {/* Timeline Section */}
          {timelineBlocks.length > 0 && (
            <WikiSection id="timeline" level={3}>
              <BlockBuilder rows={timelineBlocks} />
            </WikiSection>
          )}

          {/* Q&A Section */}
          {qaBlocks.length > 0 && (
            <WikiSection id="qa" title="Q&A" level={3}>
              <BlockBuilder rows={qaBlocks} />
            </WikiSection>
          )}
        </WikiMainContent>
      </WikiLayout>
    </div>
  );
}
