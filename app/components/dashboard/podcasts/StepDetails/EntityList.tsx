import type { BaseEntity, EntityType } from "@/app/types/entities";
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
} from "@/app/types/entities";

type PodcastEntity =
  | PersonEntity
  | OrganizationEntity
  | LocationEntity
  | EventEntity
  | TopicEntity
  | ConceptEntity;

interface EntityListProps {
  entities: PodcastEntity[];
}

const getEntityDetails = (
  entity: PodcastEntity
): { label: string; value?: string } => {
  switch (entity.type) {
    case "PERSON":
      return { label: "Role", value: (entity as PersonEntity).role };
    case "ORGANIZATION":
      return {
        label: "Industry",
        value: (entity as OrganizationEntity).industry,
      };
    case "LOCATION":
      return { label: "Type", value: (entity as LocationEntity).locationType };
    case "EVENT":
      return { label: "Date", value: (entity as EventEntity).date };
    case "TOPIC":
      return {
        label: "Subtopics",
        value: (entity as TopicEntity).subtopics?.join(", "),
      };
    case "CONCEPT":
      return {
        label: "Definition",
        value: (entity as ConceptEntity).definition,
      };
    default: {
      const _exhaustiveCheck: never = entity;
      return { label: "Unknown", value: "Unknown entity type" };
    }
  }
};

export const EntityList = ({ entities }: EntityListProps) => {
  if (!entities || entities.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="space-y-4">
        {entities.map((entity, index) => (
          <div key={index} className="p-3 rounded bg-secondary/10">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{entity.name}</span>
                {entity.context && (
                  <span className="text-xs text-muted-foreground">
                    {entity.context}
                  </span>
                )}
              </div>
              <span className="text-xs bg-secondary/20 px-2 py-1 rounded">
                {entity.type}
              </span>
            </div>
            {entity.mentions && entity.mentions.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">
                  Mentions: {entity.mentions.map((m) => m.text).join(", ")}
                </span>
              </div>
            )}
            {entity.relationships && entity.relationships.length > 0 && (
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">
                  Related to:{" "}
                  {entity.relationships
                    .map((rel) => `${rel.entity} (${rel.relationship})`)
                    .join(", ")}
                </span>
              </div>
            )}
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">
                {getEntityDetails(entity).label}:{" "}
                {getEntityDetails(entity).value || "N/A"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
