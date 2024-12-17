import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

export function TimelineBlock({
  title,
  events,
  description,
}: TimelineBlockProps) {
  const getEventTypeColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "milestone":
        return "bg-blue-500";
      case "decision":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getImportanceStyle = (importance: TimelineEvent["importance"]) => {
    switch (importance) {
      case "high":
        return "border-l-4";
      case "medium":
        return "border-l-2";
      default:
        return "border-l";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={index}
              className={cn(
                "pl-4",
                getImportanceStyle(event.importance),
                "border-l-blue-500"
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
