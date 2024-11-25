import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";
import type { PodcastEntity } from "@/app/schemas/podcast/entities";

export const mockPodcastAnalysis: PodcastAnalysis = {
  title: "The Future of AI in Healthcare",
  duration: 45,
  speakers: ["Dr. Jane Smith", "Prof. John Doe"],
  keyPoints: [
    "AI can detect patterns humans might miss, leading to earlier diagnosis",
    "Technical and ethical challenges exist in integrating AI into healthcare systems",
    "Ethical implications of using AI in medical decision-making need consideration",
    "AI could enhance surgical procedures in the future",
    "Human expertise remains crucial alongside AI technologies",
  ],
  summary:
    "In this episode, we explore the potential impact of artificial intelligence on the healthcare industry. Our guest, Prof. John Doe, shares insights on how AI is revolutionizing diagnosis, treatment planning, and patient care. The discussion covers early disease detection, implementation challenges, ethical considerations, and future prospects of AI in healthcare.",
  entities: [
    {
      name: "Dr. Jane Smith",
      type: "PERSON",
      count: 12,
      context: "AI researcher and healthcare professional",
    },
    {
      name: "Prof. John Doe",
      type: "PERSON",
      count: 15,
      context: "Leading expert in AI applications in healthcare",
    },
    {
      name: "AI Health Institute",
      type: "ORGANIZATION",
      count: 3,
      context: "Leading institute for AI in healthcare research",
    },
    {
      name: "Healthcare Industry",
      type: "ORGANIZATION",
      count: 5,
      context: "General references to the healthcare sector",
    },
  ],
  topics: [
    "AI in Early Disease Detection",
    "Ethical Considerations in AI Healthcare",
    "Machine Learning in Diagnostics",
    "AI-Assisted Surgery",
    "Patient Data Privacy",
    "Healthcare Automation",
  ],
  sections: [
    {
      title: "Introduction and Overview",
      startTime: "00:00:00",
      endTime: "00:05:30",
      content:
        "Dr. Jane Smith introduces the topic and guest Prof. John Doe, setting the context for the discussion about AI's role in healthcare.",
    },
    {
      title: "AI in Early Disease Detection",
      startTime: "00:05:30",
      endTime: "00:15:00",
      content:
        "Discussion of how AI systems can analyze medical data to detect diseases earlier than traditional methods, with specific examples from recent research studies.",
    },
    {
      title: "Implementation Challenges",
      startTime: "00:15:00",
      endTime: "00:25:00",
      content:
        "Exploration of technical and organizational challenges in implementing AI systems in healthcare settings, including integration with existing systems and staff training requirements.",
    },
    {
      title: "Ethical Considerations",
      startTime: "00:25:00",
      endTime: "00:35:00",
      content:
        "In-depth discussion of ethical implications, including patient privacy, algorithmic bias, and the balance between AI and human decision-making in healthcare.",
    },
    {
      title: "Future Prospects",
      startTime: "00:35:00",
      endTime: "00:45:00",
      content:
        "Overview of upcoming developments in AI healthcare technology, including AI-assisted surgery, personalized medicine, and predictive healthcare.",
    },
  ],
  conclusion:
    "The discussion highlights both the immense potential and significant challenges of implementing AI in healthcare. While AI shows promise in areas like early disease detection and treatment planning, successful integration requires careful consideration of ethical implications and maintaining the crucial role of human expertise. The future of healthcare likely lies in finding the right balance between AI capabilities and human medical professionals.",
};

export const sidebarNavItems = [
  {
    title: "Overview",
    href: "#overview",
  },
  {
    title: "Key Points",
    href: "#key-points",
  },
  {
    title: "Summary",
    href: "#summary",
  },
  {
    title: "Analysis",
    href: "#analysis",
  },
  {
    title: "Sections",
    href: "#sections",
  },
  {
    title: "Conclusion",
    href: "#conclusion",
  },
];
