import { ContainerBlock } from "./container-block";
import { Card } from "@/components/ui/card";
import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";

interface KeyPointsBlockProps {
  analysis: PodcastAnalysis;
}

export function KeyPointsBlock({ analysis }: KeyPointsBlockProps) {
  return (
    <ContainerBlock
      title="Key Points"
      description="Main insights and takeaways"
    >
      <div className="grid gap-2">
        {analysis.keyPoints.map((point, index) => (
          <Card key={index} className="p-3">
            <p className="text-sm">{point}</p>
          </Card>
        ))}
      </div>
    </ContainerBlock>
  );
}
