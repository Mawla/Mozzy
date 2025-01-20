import * as React from "react";
import { ContainerBlock } from "./container-block";
import { MetricBlock } from "./metric-block";
import type { ProcessingAnalysis } from "@/app/core/processing/types/base";
import type { BaseEntity } from "@/app/types/entities";

interface OverviewBlockProps {
  analysis: ProcessingAnalysis;
  entities: BaseEntity[];
}

export function OverviewBlock({ analysis, entities }: OverviewBlockProps) {
  return (
    <ContainerBlock
      title="Podcast Overview"
      description={analysis.summary ?? "No summary available"}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricBlock
          title="Key Insights"
          value={analysis.keyPoints?.length ?? 0}
          className="col-span-1"
          icon="✨"
        />
        <MetricBlock
          title="People Mentioned"
          value={entities.filter((e: BaseEntity) => e.type === "PERSON").length}
          className="col-span-1"
          icon="👥"
        />
        <MetricBlock
          title="Organizations"
          value={
            entities.filter((e: BaseEntity) => e.type === "ORGANIZATION").length
          }
          className="col-span-1"
          icon="🏢"
        />
        <MetricBlock
          title="Topics"
          value={analysis.topics?.length ?? 0}
          className="col-span-1"
          icon="📚"
        />
      </div>
    </ContainerBlock>
  );
}
