import * as React from "react";
import { ContainerBlock } from "./container-block";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResourceGridBlockProps {
  resources: Array<{
    title: string;
    type: "article" | "video" | "tool" | "reference";
    url: string;
    description: string;
    relevance: string;
    mentioned: Array<{
      timestamp: string;
      context: string;
    }>;
  }>;
}

export function ResourceGridBlock({ resources }: ResourceGridBlockProps) {
  return (
    <ContainerBlock title="Related Resources">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{resource.title}</h3>
              <Badge>{resource.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {resource.description}
            </p>
            <div className="text-sm">
              <strong>Mentioned:</strong>
              {resource.mentioned.map((mention, j) => (
                <div key={j} className="ml-2 text-muted-foreground">
                  {mention.timestamp}: {mention.context}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </ContainerBlock>
  );
}
