"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  PodcastAnalysis,
  PodcastSection,
} from "@/app/schemas/podcast/analysis";
import { EntityList } from "./StepDetails/EntityList";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface PodcastResultsProps {
  podcastAnalysis: PodcastAnalysis;
}

export const PodcastResults = ({ podcastAnalysis }: PodcastResultsProps) => {
  return (
    <div className="grid lg:grid-cols-5 h-full">
      {/* Sidebar */}
      <Sidebar className="hidden lg:block">
        <SidebarHeader className="border-b">
          <div className="p-4">
            <h2 className="text-lg font-semibold">{podcastAnalysis.title}</h2>
            <p className="text-sm text-muted-foreground">
              {podcastAnalysis.duration} minutes
            </p>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Overview</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Key Points</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Summary</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Analysis</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Sections</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Conclusion</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Main Content */}
      <div className="col-span-3 lg:col-span-4 lg:border-l">
        <div className="h-full px-4 py-6 lg:px-8">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-6">
              {/* Overview Section */}
              <section id="overview">
                <h2 className="text-2xl font-bold mb-4">Podcast Overview</h2>
                <Card className="p-6">
                  <div className="grid gap-4">
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
                        {podcastAnalysis.speakers.map((speaker: string) => (
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
              </section>

              {/* Key Points Section */}
              <section id="key-points">
                <h2 className="text-2xl font-bold mb-4">Key Points</h2>
                <Card className="p-6">
                  <ul className="list-disc pl-6 space-y-2">
                    {podcastAnalysis.keyPoints.map(
                      (point: string, index: number) => (
                        <li key={index}>{point}</li>
                      )
                    )}
                  </ul>
                </Card>
              </section>

              {/* Summary Section */}
              <section id="summary">
                <h2 className="text-2xl font-bold mb-4">Summary</h2>
                <Card className="p-6">
                  <p className="whitespace-pre-wrap">
                    {podcastAnalysis.summary}
                  </p>
                </Card>
              </section>

              {/* Transcript Analysis */}
              <section id="analysis">
                <h2 className="text-2xl font-bold mb-4">Transcript Analysis</h2>
                <Card className="p-6">
                  <div className="grid gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Named Entities</h3>
                      <EntityList entities={podcastAnalysis.entities} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Topics</h3>
                      <div className="flex gap-2 flex-wrap">
                        {podcastAnalysis.topics.map((topic: string) => (
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
              </section>

              {/* Sections */}
              <section id="sections">
                <h2 className="text-2xl font-bold mb-4">Sections</h2>
                <div className="space-y-4">
                  {podcastAnalysis.sections.map(
                    (section: PodcastSection, index: number) => (
                      <Card key={index} className="p-6">
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold">
                            {section.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {section.startTime} - {section.endTime}
                          </p>
                          <p>{section.content}</p>
                        </div>
                      </Card>
                    )
                  )}
                </div>
              </section>

              {/* Conclusion */}
              <section id="conclusion">
                <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
                <Card className="p-6">
                  <p className="whitespace-pre-wrap">
                    {podcastAnalysis.conclusion}
                  </p>
                </Card>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
