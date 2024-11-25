import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";
import type { PodcastEntity } from "@/app/schemas/podcast/entities";

export const mockPodcastAnalysis: PodcastAnalysis = {
  title: "Duolingo's Journey: From Academia to $9B EdTech Leader",
  duration: 45,
  speakers: ["Ben", "David", "Luis von Ahn"],
  keyPoints: [
    "Duolingo started as a PhD thesis project in 2011 at Carnegie Mellon",
    "The company focused on user retention and engagement before monetization until 2017",
    "Gamification and motivation are key factors in Duolingo's success",
    "The company expanded the language learning market, especially in English-speaking countries",
    "AI and large language models are transforming Duolingo's content creation",
    "The company aims to make education accessible while building a sustainable business",
    "Duolingo's mascot (green owl) has become a significant marketing asset",
    "The company's mission is deeply rooted in providing accessible education globally",
  ],
  summary:
    "In this episode, Luis von Ahn, co-founder and CEO of Duolingo, shares the company's journey from a Carnegie Mellon research project to a $9 billion publicly-traded education technology company. The discussion covers Duolingo's evolution, its focus on user engagement through gamification, the strategic decision to delay monetization, and the impact of AI on language learning. Luis also shares insights about his background in Guatemala and how it influenced Duolingo's mission to provide accessible education globally.",
  entities: [
    {
      name: "Luis von Ahn",
      type: "PERSON",
      count: 42,
      context:
        "Co-founder and CEO of Duolingo, former Carnegie Mellon professor",
    },
    {
      name: "Carnegie Mellon",
      type: "ORGANIZATION",
      count: 8,
      context: "University where Duolingo originated as a research project",
    },
    {
      name: "Duolingo",
      type: "ORGANIZATION",
      count: 56,
      context:
        "Leading language learning platform and education technology company",
    },
    {
      name: "Guatemala",
      type: "LOCATION",
      count: 12,
      context: "Luis von Ahn's home country, influencing Duolingo's mission",
    },
    {
      name: "Union Square Ventures",
      type: "ORGANIZATION",
      count: 3,
      context: "First major investor in Duolingo in 2011",
    },
    {
      name: "Brad Burnham",
      type: "PERSON",
      count: 2,
      context: "Partner at Union Square Ventures who joined Duolingo's board",
    },
    {
      name: "Google Capital",
      type: "ORGANIZATION",
      count: 2,
      context: "Later renamed to CapitalG, invested in Duolingo",
    },
    {
      name: "Laela Sturdy",
      type: "PERSON",
      count: 1,
      context: "Partner at CapitalG who pushed for monetization",
    },
  ],
  topics: [
    "Education Technology",
    "Language Learning",
    "Startup Growth",
    "Gamification",
    "User Retention",
    "Monetization Strategy",
    "Artificial Intelligence",
    "Product Development",
    "Company Culture",
    "Global Education Access",
  ],
  sections: [
    {
      title: "Company Origins and Early Development",
      content:
        "Duolingo began as a PhD thesis project at Carnegie Mellon in 2011. The founders initially created Spanish and German courses to learn each other's languages, discovering early on that 30-minute lessons were too long and user engagement was crucial. This led to the development of shorter, more engaging lesson formats.",
      qa: [
        {
          question: "How did Duolingo start?",
          answer:
            "Duolingo started as a PhD thesis project at Carnegie Mellon in 2011, with the founders initially creating Spanish and German courses to learn each other's languages.",
        },
        {
          question: "What was an early key learning?",
          answer:
            "They discovered that 30-minute lessons were too long and needed to be shortened to 3-minute chunks to improve user engagement and retention.",
        },
      ],
    },
    {
      title: "Growth and Monetization Strategy",
      content:
        "The company focused exclusively on user retention and growth from 2012 to 2017, making no revenue during this period. This strategy allowed them to optimize their product without the pressure of monetization. In 2017, after raising funding from CapitalG at a $500 million valuation, they began implementing a freemium model with ads and subscriptions.",
      qa: [
        {
          question: "When did Duolingo start monetizing?",
          answer:
            "Duolingo began monetizing in 2017, after focusing exclusively on user retention and growth for the first five years.",
        },
        {
          question: "What is their business model?",
          answer:
            "They use a freemium model with ads in the free version and a subscription option to remove ads and access additional features.",
        },
      ],
    },
    {
      title: "Product Development and AI Integration",
      content:
        "Duolingo has heavily invested in A/B testing, running approximately 2000 tests per year to optimize their product. Recently, they've integrated AI and large language models to accelerate content creation and enable new features like conversational practice with animated characters.",
      qa: [
        {
          question: "How does Duolingo use AI?",
          answer:
            "Duolingo uses AI and large language models to create content faster and enable features like conversational practice with animated characters.",
        },
        {
          question: "What role does testing play in development?",
          answer:
            "The company runs about 2000 A/B tests per year to optimize their product and user experience.",
        },
      ],
    },
    {
      title: "Brand and Marketing Strategy",
      content:
        "The company's green owl mascot has become a significant marketing asset, driving approximately 15% of new user acquisition through social media presence and memes. The mascot's personality evolved organically through notification messages and community engagement.",
      qa: [
        {
          question: "How important is the owl mascot to Duolingo?",
          answer:
            "The owl mascot drives approximately 15% of new user acquisition through social media and has become a valuable marketing asset worth hundreds of millions in earned media.",
        },
      ],
    },
  ],
  conclusion:
    "Duolingo's success stems from its unwavering focus on user engagement and retention, strategic approach to monetization, and commitment to making education accessible. The company has effectively leveraged technology, including AI, while building a strong brand identity. Their journey from an academic project to a leading education technology company demonstrates the value of prioritizing user experience and maintaining a clear mission while building a sustainable business model.",
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
