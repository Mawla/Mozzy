import * as React from "react";
import { ContainerBlock } from "./container-block";
import { MetricBlock } from "./metric-block";
import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";
import type { PodcastEntity } from "@/app/schemas/podcast/entities";

interface OverviewBlockProps {
  analysis: PodcastAnalysis;
}

export function OverviewBlock({ analysis }: OverviewBlockProps) {
  return (
    <ContainerBlock title="Podcast Overview" description={analysis.summary}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricBlock
          title="Key Insights"
          value={analysis.keyPoints.length}
          className="col-span-1"
          icon="✨"
        />
        <MetricBlock
          title="People Mentioned"
          value={
            analysis.entities.filter((e: PodcastEntity) => e.type === "PERSON")
              .length
          }
          className="col-span-1"
          icon="👥"
        />
        <MetricBlock
          title="Organizations"
          value={
            analysis.entities.filter(
              (e: PodcastEntity) => e.type === "ORGANIZATION"
            ).length
          }
          className="col-span-1"
          icon="🏢"
        />
        <MetricBlock
          title="Topics"
          value={analysis.topics.length}
          className="col-span-1"
          icon="📚"
        />
      </div>
    </ContainerBlock>
  );
}
