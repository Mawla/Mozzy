"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";
import { TableOfContentsBlock } from "@/app/components/blocks/table-of-contents-block";
import { RelatedTopicsBlock } from "@/app/components/blocks/related-topics-block";
import { transformPodcastData } from "@/app/services/podcast/transformers";
import {
  OverviewBlock,
  AnalysisBlock,
  SectionsBlock,
} from "@/app/components/blocks";

interface PodcastResultsProps {
  podcastAnalysis: PodcastAnalysis;
}

export const PodcastResults = ({ podcastAnalysis }: PodcastResultsProps) => {
  const { topics, references, headings } =
    transformPodcastData(podcastAnalysis);

  return (
    <div className="h-full w-full">
      <div className="container mx-auto">
        <div className="flex gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-6 p-6">
                <OverviewBlock analysis={podcastAnalysis} />
                <AnalysisBlock analysis={podcastAnalysis} />
                <SectionsBlock analysis={podcastAnalysis} />
              </div>
            </ScrollArea>
          </div>

          {/* Right Sidebar */}
          <div className="w-64 flex-none">
            <div className="sticky top-4 space-y-6">
              <TableOfContentsBlock headings={headings} />
              <RelatedTopicsBlock topics={topics} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
