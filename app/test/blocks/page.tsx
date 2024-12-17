"use client";

import { BlockBuilder } from "@/app/components/blocks/block-builder";
import { transformToBlocks } from "@/app/services/podcast/transformers";
import { ProcessedPodcast } from "@/app/types/podcast";
import { Card } from "@/components/ui/card";

const testData: ProcessedPodcast = {
  id: "test-1",
  title: "Test Podcast",
  summary:
    "A fascinating discussion about the future of AI and its impact on society.",
  quickFacts: {
    duration: "1h 30m",
    participants: ["John Doe", "Jane Smith"],
    mainTopic: "AI and Machine Learning",
    expertise: "Technical",
  },
  keyPoints: [
    "AI is advancing rapidly",
    "Ethics in AI is crucial",
    "Machine learning is transforming industries",
  ],
  themes: [
    {
      name: "AI Ethics",
      description: "Discussion about ethical considerations in AI development",
      relatedConcepts: ["privacy", "bias", "transparency"],
    },
    {
      name: "Technical Innovation",
      description: "Overview of recent breakthroughs in AI",
      relatedConcepts: ["deep learning", "neural networks", "GPT"],
    },
  ],
  sections: [
    {
      title: "Introduction",
      content: "Overview of current AI landscape and ethical considerations",
      startTime: "00:00:00",
      endTime: "00:15:00",
      qa: [
        {
          question: "What are the main challenges in AI ethics?",
          answer: "Privacy concerns, bias in data, and ensuring transparency",
          context: "Discussion of ethical frameworks",
          topics: ["ethics", "challenges", "privacy"],
        },
      ],
    },
    {
      title: "Technical Deep Dive",
      content: "Exploration of recent AI breakthroughs and their implications",
      startTime: "00:15:00",
      endTime: "00:30:00",
      qa: [
        {
          question: "How do neural networks work?",
          answer:
            "Neural networks process data through interconnected layers of nodes",
          context: "Technical discussion section",
          topics: ["neural networks", "deep learning", "AI architecture"],
        },
      ],
    },
  ],
  people: [],
  organizations: [],
  locations: [],
  events: [],
  timeline: [],
  metrics: [
    {
      label: "Duration",
      value: "1h 30m",
    },
    {
      label: "Participants",
      value: 2,
    },
  ],
};

export default function TestBlocksPage() {
  try {
    const blocks = transformToBlocks(testData);

    if (!blocks || blocks.length === 0) {
      return (
        <div className="container mx-auto py-8">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              No blocks available to display
            </p>
          </Card>
        </div>
      );
    }

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Block System Test</h1>
        <BlockBuilder rows={blocks} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering blocks:", error);
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 border-destructive">
          <p className="text-center text-destructive">
            Error rendering blocks. Please check the console for details.
          </p>
        </Card>
      </div>
    );
  }
}
