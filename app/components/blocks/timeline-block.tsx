import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { logger } from "@/app/services/logger";
import { withErrorBoundary } from "@/app/components/error-boundary";

interface TimelineEvent {
  title: string;
  description: string;
  date: string;
  type: "milestone" | "event" | "decision";
  importance: "high" | "medium" | "low";
}

interface TimelineBlockProps {
  title: string;
  events: TimelineEvent[];
  description?: string;
}

function TimelineBlockComponent({
  title,
  events,
  description,
}: TimelineBlockProps) {
  const getEventTypeColor = React.useCallback((type: TimelineEvent["type"]) => {
    try {
      switch (type) {
        case "milestone":
          return "bg-blue-500 text-white";
        case "decision":
          return "bg-green-500 text-white";
        default:
          return "bg-gray-500 text-white";
      }
    } catch (error) {
      logger.error("Error getting event type color", error as Error);
      return "bg-gray-500 text-white";
    }
  }, []);

  const getImportanceStyle = React.useCallback(
    (importance: TimelineEvent["importance"]) => {
      try {
        switch (importance) {
          case "high":
            return "border-l-4 border-l-blue-500";
          case "medium":
            return "border-l-2 border-l-blue-400";
          default:
            return "border-l border-l-blue-300";
        }
      } catch (error) {
        logger.error("Error getting importance style", error as Error);
        return "border-l border-l-blue-300";
      }
    },
    []
  );

  const renderEvent = React.useCallback(
    (event: TimelineEvent, index: number) => {
      try {
        return (
          <div
            key={index}
            className={cn(
              "pl-4 py-2 relative",
              getImportanceStyle(event.importance)
            )}
          >
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{event.title}</h4>
              <Badge
                variant="secondary"
                className={cn("text-xs", getEventTypeColor(event.type))}
              >
                {event.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {event.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
          </div>
        );
      } catch (error) {
        logger.error(`Error rendering event ${index}`, error as Error);
        return null;
      }
    },
    [getEventTypeColor, getImportanceStyle]
  );

  if (!Array.isArray(events)) {
    logger.error("Timeline events must be an array");
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">{events.map(renderEvent)}</div>
      </CardContent>
    </Card>
  );
}

// Wrap with error boundary
export const TimelineBlock = withErrorBoundary(TimelineBlockComponent, {
  name: "TimelineBlock",
});
