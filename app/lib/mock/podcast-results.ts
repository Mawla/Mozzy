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
      title: "AI in Early Disease Detection",
      content:
        "AI systems have shown remarkable capabilities in detecting diseases at early stages. The discussion highlighted how machine learning algorithms can analyze complex medical data to identify patterns that human observers might miss. Several examples were provided, including applications in cancer detection, cardiovascular disease prediction, and neurological disorder diagnosis.",
      qa: [
        {
          question: "How does AI improve disease detection?",
          answer:
            "AI improves disease detection by analyzing complex patterns in medical data that might be missed by human observers, leading to earlier and more accurate diagnoses.",
        },
        {
          question: "What types of diseases can AI help detect?",
          answer:
            "AI has shown promise in detecting various conditions, including cancers, cardiovascular diseases, and neurological disorders, often at earlier stages than traditional methods.",
        },
      ],
    },
    {
      title: "Implementation Challenges",
      content:
        "The implementation of AI in healthcare settings faces several technical and organizational challenges. These include integrating AI systems with existing healthcare infrastructure, ensuring data privacy and security, training healthcare professionals to work with AI tools, and managing the transition to AI-enhanced workflows.",
      qa: [
        {
          question:
            "What are the main challenges in implementing AI in healthcare?",
          answer:
            "The main challenges include technical integration with existing systems, data privacy concerns, staff training requirements, and managing the organizational change process.",
        },
      ],
    },
    {
      title: "Ethical Considerations",
      content:
        "The discussion emphasized the importance of addressing ethical implications in AI healthcare applications. Key concerns include patient privacy, algorithmic bias, transparency in AI decision-making, and maintaining the appropriate balance between AI assistance and human medical judgment.",
      qa: [
        {
          question: "What are the key ethical concerns?",
          answer:
            "The key ethical concerns include protecting patient privacy, ensuring algorithmic fairness, maintaining transparency in AI decisions, and balancing AI capabilities with human medical expertise.",
        },
      ],
    },
    {
      title: "Future Prospects",
      content:
        "Looking ahead, the potential applications of AI in healthcare continue to expand. The discussion explored upcoming developments in AI-assisted surgery, personalized medicine, predictive healthcare, and the integration of AI with other emerging medical technologies.",
      qa: [
        {
          question: "What are the most promising future applications?",
          answer:
            "The most promising applications include AI-assisted surgery, personalized treatment planning, predictive healthcare analytics, and integration with emerging medical technologies.",
        },
      ],
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
