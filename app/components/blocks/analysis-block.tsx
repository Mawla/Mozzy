import * as React from "react";
import { Card } from "@/components/ui/card";
import { ContainerBlock } from "./container-block";
import { EntityList } from "../dashboard/podcasts/StepDetails/EntityList";
import { Badge } from "@/components/ui/badge";
import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";

interface AnalysisBlockProps {
  analysis: PodcastAnalysis;
}

export function AnalysisBlock({ analysis }: AnalysisBlockProps) {
  return (
    <ContainerBlock title="Content Analysis">
      <Card className="mt-4">
        <div className="p-6 grid gap-6">
          <div>
            <h3 className="font-semibold mb-3">Named Entities</h3>
            <EntityList entities={analysis.entities} />
          </div>
          <div>
            <h3 className="font-semibold mb-3">Topics</h3>
            <div className="flex gap-2 flex-wrap">
              {analysis.topics.map((topic: string) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </ContainerBlock>
  );
}
