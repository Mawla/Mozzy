import type { EntityType } from "@/app/types/entities/base";
import type {
  ValidatedPersonEntity,
  ValidatedOrganizationEntity,
  ValidatedLocationEntity,
  ValidatedEventEntity,
  ValidatedTopicEntity,
  ValidatedConceptEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities";

type ValidatedEntity =
  | ValidatedPersonEntity
  | ValidatedOrganizationEntity
  | ValidatedLocationEntity
  | ValidatedEventEntity
  | ValidatedTopicEntity
  | ValidatedConceptEntity;

interface EntityListProps {
  entities: ValidatedEntity[];
}

const getEntityDetails = (
  entity: ValidatedEntity
): { label: string; value?: string } => {
  switch (entity.type) {
    case "PERSON":
      return { label: "Role", value: entity.role };
    case "ORGANIZATION":
      return {
        label: "Industry",
        value: entity.industry,
      };
    case "LOCATION": {
      const details = [`Type: ${entity.locationType}`];
      if (entity.region) {
        details.push(`Region: ${entity.region}`);
      }
      if (entity.coordinates) {
        details.push(
          `Coordinates: ${entity.coordinates.latitude}, ${entity.coordinates.longitude}`
        );
      }
      return { label: "Details", value: details.join(" | ") };
    }
    case "EVENT":
      return { label: "Date", value: entity.date };
    case "TOPIC":
      return {
        label: "Subtopics",
        value: entity.subtopics?.join(", "),
      };
    case "CONCEPT":
      return {
        label: "Definition",
        value: entity.definition,
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
