import * as React from "react";
import { ContainerBlock } from "./container-block";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TakeawaysBlockProps {
  insights: Array<{
    title: string;
    description: string;
    evidence: Array<{
      type: "quote" | "metric" | "example";
      content: string;
      source: string;
    }>;
    applicability: string[];
    limitations: string[];
  }>;
}

export function TakeawaysBlock({ insights }: TakeawaysBlockProps) {
  return (
    <ContainerBlock title="Key Insights">
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <Card key={i} className="p-4">
            <h3 className="font-medium mb-2">{insight.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {insight.description}
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Evidence</h4>
                {insight.evidence.map((item, j) => (
                  <div key={j} className="flex gap-2 items-start mb-2">
                    <Badge variant="outline">{item.type}</Badge>
                    <div className="text-sm">
                      <p>{item.content}</p>
                      <p className="text-muted-foreground text-xs">
                        Source: {item.source}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Applicability</h4>
                  <ul className="list-disc pl-4 text-sm">
                    {insight.applicability.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Limitations</h4>
                  <ul className="list-disc pl-4 text-sm">
                    {insight.limitations.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ContainerBlock>
  );
}
