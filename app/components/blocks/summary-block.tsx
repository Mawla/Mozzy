import { ContainerBlock } from "./container-block";
import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";

interface SummaryBlockProps {
  analysis: PodcastAnalysis;
}

export function SummaryBlock({ analysis }: SummaryBlockProps) {
  return (
    <ContainerBlock title="Summary">
      <div className="prose dark:prose-invert">
        <p className="text-muted-foreground">{analysis.summary}</p>
      </div>
    </ContainerBlock>
  );
}
