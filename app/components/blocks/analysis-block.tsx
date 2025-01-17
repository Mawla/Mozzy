import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { EntityList } from "../dashboard/podcasts/StepDetails/EntityList";
import { Badge } from "@/components/ui/badge";
import type { PodcastAnalysis } from "@/app/types/podcast/models";

interface AnalysisBlockProps {
  analysis: PodcastAnalysis;
}

export function AnalysisBlock({ analysis }: AnalysisBlockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analysis.themes && analysis.themes.length > 0 && (
            <Section
              id="themes-section"
              title="Themes"
              content="Key themes identified in the content:"
            >
              <div className="flex flex-wrap gap-2">
                {analysis.themes.map((theme, index) => (
                  <Badge key={index} variant="secondary">
                    {theme.name}
                  </Badge>
                ))}
              </div>
            </Section>
          )}

          {analysis.keyPoints && analysis.keyPoints.length > 0 && (
            <Section
              id="key-points-section"
              title="Key Points"
              content="Main points and takeaways from the content:"
            >
              <div className="space-y-2">
                {analysis.keyPoints.map((point, index) => (
                  <div key={index}>
                    <h4 className="font-medium">{point.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
