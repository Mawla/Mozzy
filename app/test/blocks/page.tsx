import { BlockBuilder } from "@/components/blocks/block-builder";

const testData = {
  quickFacts: {
    duration: "1h 30m",
    participants: ["John Doe", "Jane Smith"],
    mainTopic: "AI and Machine Learning",
    expertise: "Technical",
  },
  summary:
    "A fascinating discussion about the future of AI and its impact on society.",
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
      relevance: 0.9,
    },
    {
      name: "Technical Innovation",
      description: "Overview of recent breakthroughs in AI",
      relatedConcepts: ["deep learning", "neural networks", "GPT"],
      relevance: 0.8,
    },
  ],
};

export default function TestBlocksPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Block System Test</h1>
      <BlockBuilder
        rows={[
          // Quick Facts
          {
            id: "quick-facts",
            blocks: [
              {
                id: "quick-facts-block",
                layout: "full",
                sections: [
                  {
                    title: "Quick Facts",
                    fields: [
                      {
                        type: "text",
                        label: "Duration",
                        value: testData.quickFacts.duration,
                      },
                      {
                        type: "list",
                        label: "Participants",
                        value: testData.quickFacts.participants,
                      },
                      {
                        type: "text",
                        label: "Main Topic",
                        value: testData.quickFacts.mainTopic,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // Summary
          {
            id: "summary",
            blocks: [
              {
                id: "summary-block",
                layout: "full",
                sections: [
                  {
                    title: "Summary",
                    fields: [
                      {
                        type: "text",
                        label: "Overview",
                        value: testData.summary,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // Key Points
          {
            id: "key-points",
            blocks: [
              {
                id: "key-points-block",
                layout: "full",
                sections: [
                  {
                    title: "Key Points",
                    fields: [
                      {
                        type: "list",
                        label: "Main Takeaways",
                        value: testData.keyPoints,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // Themes (split into two columns)
          {
            id: "themes",
            blocks: [
              {
                id: "themes-left",
                layout: "half",
                sections: [
                  {
                    title: "Theme 1",
                    fields: [
                      {
                        type: "grid",
                        label: testData.themes[0].name,
                        value: [
                          {
                            description: testData.themes[0].description,
                            concepts: testData.themes[0].relatedConcepts,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: "themes-right",
                layout: "half",
                sections: [
                  {
                    title: "Theme 2",
                    fields: [
                      {
                        type: "grid",
                        label: testData.themes[1].name,
                        value: [
                          {
                            description: testData.themes[1].description,
                            concepts: testData.themes[1].relatedConcepts,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]}
      />
    </div>
  );
}
