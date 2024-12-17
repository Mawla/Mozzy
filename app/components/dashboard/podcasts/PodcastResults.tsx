"use client";

import * as React from "react";
import { Podcast, ProcessedPodcast } from "@/app/types/podcast";
import { transformToBlocks } from "@/app/services/podcast/transformers";
import { Button } from "@/components/ui/button";
import { Clock, Download, Share2 } from "lucide-react";
import { BlockRenderer } from "@/app/components/blocks/block-renderer";

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

  const actions = (
    <>
      <Button variant="outline" size="sm">
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
      <Button variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    </>
  );

  const subtitle = (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4" />
      <span>{podcast.duration || analysis?.quickFacts?.duration}</span>
    </div>
  );

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <BlockRenderer
        blocks={blocks}
        title={podcast.title}
        subtitle={subtitle}
        actions={actions}
      />
    </div>
  );
}
