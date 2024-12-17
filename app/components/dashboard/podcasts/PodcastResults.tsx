"use client";

import * as React from "react";
import { Podcast, ProcessedPodcast } from "@/app/types/podcast";
import { BlockBuilder } from "@/app/components/blocks";
import { transformToBlocks } from "@/app/services/podcast/transformers";
import { Button } from "@/components/ui/button";
import { Clock, Download, Share2 } from "lucide-react";
import {
  BlockLayout,
  BlockNavigation,
  BlockSidebar,
  BlockContent,
} from "@/app/components/blocks/layout";

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

  // Separate blocks into main content and sidebar
  const sidebarBlocks = blocks.filter(
    (row) => row.id === "quick-facts" || row.id === "metrics"
  );
  const mainBlocks = blocks.filter(
    (row) => row.id !== "quick-facts" && row.id !== "metrics"
  );

  // Create navigation sections based on main blocks
  const navigationSections = [
    {
      id: "main",
      title: "Main Sections",
      items: mainBlocks.map((block) => {
        const title = block.blocks[0]?.sections[0]?.title || "";
        return {
          id: block.id,
          title: title,
        };
      }),
    },
  ];

  // Transform sidebar blocks into block sidebar sections
  const sidebarSections = sidebarBlocks.map((block) => ({
    id: block.id,
    title: block.blocks[0]?.sections[0]?.title || "",
    content: <BlockBuilder rows={[block]} />,
  }));

  // Render each main block as a block section
  const renderMainBlocks = (blocks: BlockRow[]) => {
    return blocks.map((block) => (
      <div
        key={block.id}
        id={block.id}
        data-section-id={block.id}
        className="mb-8"
      >
        <BlockBuilder rows={[block]} />
      </div>
    ));
  };

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

      {/* Block Layout */}
      <BlockLayout
        navigation={<BlockNavigation sections={navigationSections} />}
        sidebar={<BlockSidebar sections={sidebarSections} />}
        defaultNavigationWidth={160}
        defaultSidebarWidth={320}
      >
        <BlockContent>{renderMainBlocks(mainBlocks)}</BlockContent>
      </BlockLayout>
    </div>
  );
}
