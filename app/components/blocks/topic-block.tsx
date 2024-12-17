import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { logger } from "@/app/services/logger";
import { ErrorBoundaryWrapper } from "./error-boundary-wrapper";
import { Button } from "@/components/ui/button";
import { TopicItem, TopicBlockProps } from "@/app/types/topic";

function TopicBlockComponent({ title, description, topics }: TopicBlockProps) {
  const [expandedTopics, setExpandedTopics] = React.useState<Set<string>>(
    new Set()
  );

  const toggleTopic = React.useCallback((id: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const renderTopicItem = React.useCallback(
    (topic: TopicItem, level: number = 0) => {
      try {
        const isExpanded = expandedTopics.has(topic.id);
        const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;

        return (
          <div key={topic.id} className="space-y-2">
            <div className="flex items-start gap-2">
              {hasSubtopics && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6"
                  onClick={() => toggleTopic(topic.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              <div className="flex-1">
                <h4
                  className={cn(
                    "font-medium",
                    level === 0 ? "text-base" : "text-sm"
                  )}
                >
                  {topic.title}
                </h4>
                <p
                  className={cn(
                    "text-muted-foreground",
                    level === 0 ? "text-sm" : "text-xs"
                  )}
                >
                  {topic.content}
                </p>
                {topic.metadata && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {topic.metadata.timestamp && (
                      <Badge variant="secondary" className="text-xs">
                        {topic.metadata.timestamp}
                      </Badge>
                    )}
                    {topic.metadata.relevanceScore && (
                      <Badge variant="secondary" className="text-xs">
                        Relevance: {topic.metadata.relevanceScore}
                      </Badge>
                    )}
                    {topic.metadata.relatedTopics?.map((related) => (
                      <Badge
                        key={related}
                        variant="outline"
                        className="text-xs"
                      >
                        {related}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {hasSubtopics && isExpanded && (
              <div
                className={cn(
                  "pl-6 space-y-4",
                  level > 0 && "border-l-2 border-muted"
                )}
              >
                {topic.subtopics!.map((subtopic) =>
                  renderTopicItem(subtopic, level + 1)
                )}
              </div>
            )}
          </div>
        );
      } catch (error) {
        logger.error(`Error rendering topic ${topic.id}`, error as Error);
        return null;
      }
    },
    [expandedTopics, toggleTopic]
  );

  if (!Array.isArray(topics)) {
    logger.error("Topics must be an array");
    return null;
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {topics.map((topic) => renderTopicItem(topic))}
      </CardContent>
    </Card>
  );
}

// Wrap with error boundary wrapper
export const TopicBlock = ({ title, description, topics }: TopicBlockProps) => (
  <ErrorBoundaryWrapper name="TopicBlock">
    <TopicBlockComponent
      title={title}
      description={description}
      topics={topics}
    />
  </ErrorBoundaryWrapper>
);
