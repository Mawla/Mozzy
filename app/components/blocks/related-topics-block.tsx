import * as React from "react";
import { Badge } from "@/components/ui/badge";

interface RelatedTopicsBlockProps {
  topics: Array<{
    name: string;
    relevance: "high" | "medium" | "low";
    count: number;
  }>;
}

export function RelatedTopicsBlock({ topics }: RelatedTopicsBlockProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <Badge
          key={topic.name}
          variant={
            topic.relevance === "high"
              ? "default"
              : topic.relevance === "medium"
              ? "secondary"
              : "outline"
          }
          className="cursor-pointer hover:opacity-80"
        >
          {topic.name} ({topic.count})
        </Badge>
      ))}
    </div>
  );
}
