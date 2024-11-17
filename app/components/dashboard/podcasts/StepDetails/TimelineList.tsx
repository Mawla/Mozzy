import { Badge } from "@/components/ui/badge";
import { TimelineEvent } from "@/app/types/podcast/processing";

interface TimelineListProps {
  timeline?: TimelineEvent[];
}

export const TimelineList = ({ timeline }: TimelineListProps) => {
  if (!timeline) return null;

  return (
    <div className="mt-4">
      <div className="space-y-4">
        {timeline.map((event, index) => (
          <div
            key={index}
            className={`p-3 rounded border-l-4 ${
              event.importance === "high"
                ? "border-blue-500 bg-blue-50"
                : event.importance === "medium"
                ? "border-green-500 bg-green-50"
                : "border-gray-500 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">{event.time}</span>
              <Badge
                variant="secondary"
                className={
                  event.importance === "high"
                    ? "bg-blue-100"
                    : event.importance === "medium"
                    ? "bg-green-100"
                    : "bg-gray-100"
                }
              >
                {event.importance}
              </Badge>
            </div>
            <p className="text-sm mt-1">{event.event}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
