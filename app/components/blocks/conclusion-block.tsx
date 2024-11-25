import { ContainerBlock } from "./container-block";
import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";

interface ConclusionBlockProps {
  analysis: PodcastAnalysis;
}

export function ConclusionBlock({ analysis }: ConclusionBlockProps) {
  return (
    <ContainerBlock title="Conclusion">
      <div className="mt-6 p-4 rounded-lg bg-secondary/20">
        <p className="text-muted-foreground">{analysis.conclusion}</p>
      </div>
    </ContainerBlock>
  );
}
