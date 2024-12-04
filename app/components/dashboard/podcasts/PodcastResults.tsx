"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Podcast, ProcessedPodcast } from "@/app/types/podcast";
import { BlockBuilder } from "@/app/components/blocks/block-builder";
import { transformToBlocks } from "@/app/services/podcast/transformers";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Download,
  Share2,
  ListMusic,
  BarChart2,
  MessageSquare,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface PodcastResultsProps {
  podcast: Podcast;
  analysis: ProcessedPodcast;
}

export function PodcastResults({ podcast, analysis }: PodcastResultsProps) {
  const blocks = React.useMemo(() => transformToBlocks(analysis), [analysis]);
  const [activeSection, setActiveSection] = React.useState("overview");
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "insights", label: "Key Insights", icon: Lightbulb },
    { id: "themes", label: "Themes", icon: BarChart2 },
    { id: "timeline", label: "Timeline", icon: ListMusic },
    { id: "qa", label: "Q&A", icon: MessageSquare },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section && scrollAreaRef.current) {
      const container = scrollAreaRef.current;
      const sectionTop = section.offsetTop;
      container.scrollTo({
        top: sectionTop - 24, // Add some padding
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{podcast.title}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{podcast.duration || analysis.quickFacts.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <SidebarTrigger />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea ref={scrollAreaRef} className="flex-grow">
        <div className="container py-6">
          <div className="flex gap-6">
            {/* Navigation Sidebar */}
            <div className="w-64 flex-none">
              <div className="sticky top-6">
                <div className="rounded-lg border bg-card">
                  <SidebarHeader>
                    <h3 className="px-2 text-lg font-semibold">Navigation</h3>
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarMenu>
                      {menuItems.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() => handleSectionClick(item.id)}
                            isActive={activeSection === item.id}
                            tooltip={item.label}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarContent>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow min-w-0">
              {/* Overview Section */}
              <section id="overview" className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                <BlockBuilder
                  rows={blocks.filter((row) =>
                    ["metrics", "quick-facts"].includes(row.id)
                  )}
                />
              </section>

              {/* Key Insights Section */}
              <section id="insights" className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
                <BlockBuilder
                  rows={blocks.filter((row) => row.id === "key-points")}
                />
              </section>

              {/* Themes Section */}
              <section id="themes" className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Themes</h2>
                <BlockBuilder
                  rows={blocks.filter((row) => row.id === "themes")}
                />
              </section>

              {/* Timeline Section */}
              <section id="timeline" className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Timeline</h2>
                <BlockBuilder
                  rows={blocks.filter((row) => row.id === "timeline")}
                />
              </section>

              {/* Q&A Section */}
              <section id="qa" className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Q&A</h2>
                <BlockBuilder rows={blocks.filter((row) => row.id === "qa")} />
              </section>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
