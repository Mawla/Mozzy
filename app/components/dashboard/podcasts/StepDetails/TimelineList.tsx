import { Badge } from "@/components/ui/badge";
import type { TimelineEvent } from "@/app/core/processing/types/base";

interface TimelineListProps {
  timeline?: TimelineEvent[];
}

export const TimelineList = ({ timeline }: TimelineListProps) => {
  if (!timeline) return null;

  return (
    <div className="mt-4">
      <div className="space-y-4">
        {timeline.map((event, index) => (
          <div key={index} className="p-3 rounded border-l-4 bg-secondary/10">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{event.timestamp}</span>
                {event.time && (
                  <span className="text-xs text-muted-foreground">
                    {event.time}
                  </span>
                )}
              </div>
              {event.speakers && event.speakers.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {event.speakers.join(", ")}
                </Badge>
              )}
            </div>
            <p className="text-sm mt-2">{event.event}</p>
            {event.topics && event.topics.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {event.topics.map((topic, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-xs bg-background/50"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
