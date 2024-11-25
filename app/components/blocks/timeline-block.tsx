import { Badge } from "@/components/ui/badge";
import { ContainerBlock } from "./container-block";

interface TimelineEvent {
  title: string;
  description: string;
  date: string;
  type: "milestone" | "decision" | "event";
  importance: "high" | "medium" | "low";
}

interface TimelineViewProps {
  title: string;
  events: TimelineEvent[];
  description?: string;
  className?: string;
}

export function TimelineView({
  title,
  events,
  description,
  className,
}: TimelineViewProps) {
  return (
    <ContainerBlock
      title={title}
      description={description}
      className={className}
    >
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="relative pl-6 pb-4 border-l border-border"
          >
            <div className="absolute left-0 w-3 h-3 -translate-x-1.5 rounded-full bg-primary" />
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{event.title}</h4>
              <Badge variant="outline">{event.date}</Badge>
              <Badge>{event.type}</Badge>
              <Badge variant="secondary">{event.importance}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
        ))}
      </div>
    </ContainerBlock>
  );
}
