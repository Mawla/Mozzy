import * as React from "react";
import { Card } from "@/components/ui/card";
import { ContainerBlock } from "./container-block";
import { QAAccordion } from "../qa-accordion";
import type {
  PodcastAnalysis,
  PodcastSection,
} from "@/app/schemas/podcast/analysis";

interface SectionsBlockProps {
  analysis: PodcastAnalysis;
}

export function SectionsBlock({ analysis }: SectionsBlockProps) {
  return (
    <ContainerBlock title="Content Sections">
      <div className="mt-4 space-y-4">
        {analysis.sections.map((section: PodcastSection, index: number) => (
          <Card key={index} className="p-6">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">{section.title}</h3>
              <p>{section.content}</p>
              {section.qa && (
                <div className="mt-4">
                  <QAAccordion title="Questions & Answers" items={section.qa} />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ContainerBlock>
  );
}
