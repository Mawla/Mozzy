"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Section } from "@/app/components/section";
import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";
import { EntityList } from "./StepDetails/EntityList";
import { QAAccordion } from "@/app/components/qa-accordion";

interface PodcastResultsProps {
  podcastAnalysis: PodcastAnalysis;
}

export const PodcastResults = ({ podcastAnalysis }: PodcastResultsProps) => {
  return (
    <div className="h-full w-full">
      <div className="h-full">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 p-6">
            <Section id="overview" title="Podcast Overview" content="">
              <Card className="mt-4">
                <div className="p-6 grid gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Title</h3>
                    <p>{podcastAnalysis.title}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Duration</h3>
                    <p>{podcastAnalysis.duration} minutes</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Key Speakers</h3>
                    <div className="flex gap-2 flex-wrap">
                      {podcastAnalysis.speakers.map((speaker) => (
                        <span
                          key={speaker}
                          className="px-2 py-1 bg-secondary rounded-md text-sm"
                        >
                          {speaker}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Section>

            <Section
              id="key-points"
              title="Key Points"
              content=""
              listItems={podcastAnalysis.keyPoints}
            />

            <Section
              id="summary"
              title="Summary"
              content={podcastAnalysis.summary}
            />

            <Section id="analysis" title="Transcript Analysis" content="">
              <Card className="mt-4">
                <div className="p-6 grid gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Named Entities</h3>
                    <EntityList entities={podcastAnalysis.entities} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Topics</h3>
                    <div className="flex gap-2 flex-wrap">
                      {podcastAnalysis.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Section>

            <Section id="sections" title="Sections" content="">
              <div className="mt-4 space-y-4">
                {podcastAnalysis.sections.map((section, index) => (
                  <Card key={index} className="p-6">
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold">{section.title}</h3>
                      <p>{section.content}</p>
                      {section.qa && (
                        <div className="mt-4">
                          <QAAccordion
                            title="Questions & Answers"
                            items={section.qa}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Section>

            <Section
              id="conclusion"
              title="Conclusion"
              content={podcastAnalysis.conclusion}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
