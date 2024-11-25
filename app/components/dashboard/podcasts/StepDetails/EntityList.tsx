import type { PodcastEntity } from "@/app/schemas/podcast/entities";

interface EntityListProps {
  entities: PodcastEntity[];
}

export const EntityList = ({ entities }: EntityListProps) => {
  return (
    <div className="grid gap-2">
      {entities.map((entity) => (
        <div
          key={entity.name}
          className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">{entity.name}</span>
            <span className="text-xs text-muted-foreground">
              ({entity.type})
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {entity.count} mentions
          </span>
        </div>
      ))}
    </div>
  );
};
