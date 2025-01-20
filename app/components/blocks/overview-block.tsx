import * as React from "react";
import { ContainerBlock } from "./container-block";
import { MetricBlock } from "./metric-block";
import type { ProcessingAnalysis } from "@/app/core/processing/types/base";
import type {
  PersonEntity,
  OrganizationEntity,
  TopicEntity,
  LocationEntity,
  EventEntity,
  ConceptEntity,
} from "@/app/types/entities/podcast";

type PodcastEntity =
  | PersonEntity
  | OrganizationEntity
  | LocationEntity
  | EventEntity
  | TopicEntity
  | ConceptEntity;

interface OverviewBlockProps {
  analysis: ProcessingAnalysis;
  entities: PodcastEntity[];
}

const countEntitiesByType = <T extends PodcastEntity>(
  entities: PodcastEntity[],
  type: T["type"]
): number => {
  return entities.filter((entity): entity is T => entity.type === type).length;
};

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
          value={countEntitiesByType<PersonEntity>(entities, "PERSON")}
          className="col-span-1"
          icon="👥"
        />
        <MetricBlock
          title="Organizations"
          value={countEntitiesByType<OrganizationEntity>(
            entities,
            "ORGANIZATION"
          )}
          className="col-span-1"
          icon="🏢"
        />
        <MetricBlock
          title="Topics"
          value={countEntitiesByType<TopicEntity>(entities, "TOPIC")}
          className="col-span-1"
          icon="📚"
        />
      </div>
    </ContainerBlock>
  );
}
