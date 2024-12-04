import { ProcessedPodcast } from "@/app/types/podcast";

export const mockPodcastResults: ProcessedPodcast = {
  id: "1",
  title: "The Future of AI",
  summary:
    "A fascinating discussion about the future of AI and its impact on society, covering ethics, technical innovations, and practical applications.",
  keyPoints: [
    "AI is advancing rapidly in multiple domains",
    "Ethics in AI development is becoming increasingly important",
    "Machine learning is transforming traditional industries",
    "The role of human oversight remains crucial",
  ],
  metrics: [
    {
      label: "Key Insights",
      value: 15,
    },
    {
      label: "People Mentioned",
      value: 3,
    },
    {
      label: "Organizations",
      value: 3,
    },
    {
      label: "Locations",
      value: 3,
    },
    {
      label: "Events",
      value: 3,
    },
    {
      label: "Timeline Points",
      value: 3,
    },
  ],
  themes: [
    {
      name: "AI Ethics",
      description:
        "In-depth discussion about ethical considerations in AI development",
      relatedConcepts: ["privacy", "bias", "transparency", "accountability"],
      relevance: 0.9,
    },
    {
      name: "Technical Innovation",
      description: "Overview of recent breakthroughs in AI technology",
      relatedConcepts: [
        "deep learning",
        "neural networks",
        "GPT",
        "computer vision",
      ],
      relevance: 0.8,
    },
    {
      name: "Industry Impact",
      description: "Analysis of AI's impact on various industries",
      relatedConcepts: ["automation", "efficiency", "job market", "skills"],
      relevance: 0.7,
    },
  ],
  people: ["Dr. Sarah Johnson", "Prof. Michael Chen", "Lisa Thompson"],
  organizations: [
    "AI Ethics Institute",
    "TechCorp Research",
    "Global AI Initiative",
  ],
  locations: ["Silicon Valley", "MIT Campus", "Research Lab"],
  events: ["AI Summit 2023", "Ethics Board Meeting", "Research Presentation"],
  timeline: [
    {
      title: "Introduction to AI Ethics",
      description: "Discussion of fundamental ethical principles in AI",
      date: "00:00:00",
      type: "milestone",
      importance: "high",
    },
    {
      title: "Technical Deep Dive",
      description: "Exploration of recent AI breakthroughs",
      date: "00:30:00",
      type: "event",
      importance: "medium",
    },
    {
      title: "Industry Applications",
      description: "Real-world examples of AI implementation",
      date: "01:00:00",
      type: "milestone",
      importance: "high",
    },
  ],
  quickFacts: {
    duration: "1h 30m",
    participants: ["Dr. Sarah Johnson", "Prof. Michael Chen", "Lisa Thompson"],
    mainTopic: "Artificial Intelligence and Ethics",
    expertise: "Technical and Ethics",
  },
  sections: [
    {
      title: "Introduction",
      content: "Overview of current AI landscape",
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
      title: "Technical Discussion",
      content: "Deep dive into AI technologies",
      startTime: "00:15:00",
      endTime: "00:45:00",
      qa: [
        {
          question: "How do neural networks work?",
          answer: "Explanation of neural network architecture and training",
          context: "Technical deep dive section",
          topics: ["neural networks", "deep learning", "training"],
        },
      ],
    },
  ],
};
