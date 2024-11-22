import { Badge } from "@/components/ui/badge";
import { EntityDetails, PodcastEntities } from "@/app/schemas/podcast/entities";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EntityListProps {
  data: PodcastEntities;
}

export const EntityList = ({ data }: EntityListProps) => {
  const [expandedEntities, setExpandedEntities] = useState<
    Record<string, boolean>
  >({});

  const toggleEntity = (entityId: string | undefined) => {
    if (!entityId) return;
    setExpandedEntities((prev) => ({
      ...prev,
      [entityId]: !prev[entityId],
    }));
  };

  const renderEntityDetails = (entity: EntityDetails) => {
    if (!entity.name) return null;

    return (
      <Collapsible
        key={entity.name}
        open={expandedEntities[entity.name] || false}
        onOpenChange={() => toggleEntity(entity.name)}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            {entity.type && <Badge variant="default">{entity.type}</Badge>}
            <span className="font-medium">{entity.name}</span>
          </div>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              expandedEntities[entity.name || ""] && "rotate-90"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 space-y-2">
          {entity.context && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Context:</span> {entity.context}
            </div>
          )}
          {entity.mentions && entity.mentions.length > 0 && (
            <div className="space-y-1">
              <span className="text-sm font-medium">Mentions:</span>
              {entity.mentions.map((mention, idx) => (
                <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                  {mention.text && <p>{mention.text}</p>}
                  <div className="flex gap-2 mt-1 text-xs text-gray-500">
                    {mention.timestamp && <span>{mention.timestamp}</span>}
                    {mention.sentiment && (
                      <Badge
                        variant={
                          mention.sentiment === "positive"
                            ? "default"
                            : mention.sentiment === "negative"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {mention.sentiment}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {entity.relationships && entity.relationships.length > 0 && (
            <div className="space-y-1">
              <span className="text-sm font-medium">Relationships:</span>
              {entity.relationships.map((rel, idx) => (
                <div key={idx} className="text-sm">
                  {rel.entity && <Badge variant="outline">{rel.entity}</Badge>}
                  <span className="mx-1">-</span>
                  {rel.relationship && (
                    <span className="text-gray-600">{rel.relationship}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="space-y-4">
      {data.people && data.people.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">People</h4>
          <div className="space-y-2">
            {data.people.map((entity) => renderEntityDetails(entity))}
          </div>
        </div>
      )}
      {data.organizations && data.organizations.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Organizations</h4>
          <div className="space-y-2">
            {data.organizations.map((entity) => renderEntityDetails(entity))}
          </div>
        </div>
      )}
      {data.locations && data.locations.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Locations</h4>
          <div className="space-y-2">
            {data.locations.map((entity) => renderEntityDetails(entity))}
          </div>
        </div>
      )}
      {data.events && data.events.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Events</h4>
          <div className="space-y-2">
            {data.events.map((entity) => renderEntityDetails(entity))}
          </div>
        </div>
      )}
      {data.topics && data.topics.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Topics</h4>
          <div className="space-y-2">
            {data.topics.map((entity) => renderEntityDetails(entity))}
          </div>
        </div>
      )}
      {data.concepts && data.concepts.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Concepts</h4>
          <div className="space-y-2">
            {data.concepts.map((entity) => renderEntityDetails(entity))}
          </div>
        </div>
      )}
    </div>
  );
};
