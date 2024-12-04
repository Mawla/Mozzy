import { ContentAnalysis } from "@/app/schemas/podcast/analysis";
import { PodcastEntities } from "@/app/schemas/podcast/entities";
import { PodcastTimeline } from "@/app/schemas/podcast/timeline";

export const mockPodcastAnalysis: ContentAnalysis = {
  title: "Duolingo's Journey: From Academia to $9B EdTech Leader",
  summary:
    "In this episode, Luis von Ahn, co-founder and CEO of Duolingo, shares the company's journey from a Carnegie Mellon research project to a $9 billion publicly-traded education technology company. The discussion covers Duolingo's evolution, its focus on user engagement through gamification, the strategic decision to delay monetization, and the impact of AI on language learning. Luis also shares insights about his background in Guatemala and how it influenced Duolingo's mission to provide accessible education globally.",
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
  themes: [
    {
      name: "Education Technology Innovation",
      description:
        "The evolution of language learning through technology and AI",
      relatedConcepts: ["AI Integration", "Language Learning", "EdTech"],
      relevance: 1.0,
    },
    {
      name: "Business Strategy",
      description:
        "Strategic decisions in growth, monetization, and market expansion",
      relatedConcepts: ["Monetization", "User Retention", "Growth Strategy"],
      relevance: 0.9,
    },
    {
      name: "Product Development",
      description: "Evolution of product features and user experience",
      relatedConcepts: ["Gamification", "User Engagement", "A/B Testing"],
      relevance: 0.8,
    },
    {
      name: "Social Impact",
      description: "Mission-driven approach to accessible education",
      relatedConcepts: [
        "Global Access",
        "Education Equality",
        "Social Mission",
      ],
      relevance: 0.9,
    },
  ],
  sections: [
    {
      title: "Company Origins and Early Development",
      content:
        "Duolingo began as a PhD thesis project at Carnegie Mellon in 2011. The founders initially created Spanish and German courses to learn each other's languages, discovering early on that 30-minute lessons were too long and user engagement was crucial. This led to the development of shorter, more engaging lesson formats.",
      startTime: "00:00:00",
      endTime: "00:15:00",
      qa: [
        {
          question: "How did Duolingo start?",
          answer:
            "Duolingo started as a PhD thesis project at Carnegie Mellon in 2011, with the founders initially creating Spanish and German courses to learn each other's languages.",
          timestamp: "00:02:00",
          topics: ["Company History", "Origins", "Academic Research"],
        },
        {
          question: "What was an early key learning?",
          answer:
            "They discovered that 30-minute lessons were too long and needed to be shortened to 3-minute chunks to improve user engagement and retention.",
          timestamp: "00:08:00",
          topics: ["Product Development", "User Engagement", "Learning Design"],
        },
      ],
    },
    {
      title: "Growth and Monetization Strategy",
      content:
        "The company focused exclusively on user retention and growth from 2012 to 2017, making no revenue during this period. This strategy allowed them to optimize their product without the pressure of monetization. In 2017, after raising funding from CapitalG at a $500 million valuation, they began implementing a freemium model with ads and subscriptions.",
      startTime: "00:15:00",
      endTime: "00:25:00",
      qa: [
        {
          question: "When did Duolingo start monetizing?",
          answer:
            "Duolingo began monetizing in 2017, after focusing exclusively on user retention and growth for the first five years.",
          timestamp: "00:17:00",
          topics: ["Monetization", "Business Strategy", "Growth"],
        },
        {
          question: "What is their business model?",
          answer:
            "They use a freemium model with ads in the free version and a subscription option to remove ads and access additional features.",
          timestamp: "00:22:00",
          topics: ["Business Model", "Monetization", "User Experience"],
        },
      ],
    },
    {
      title: "Product Development and AI Integration",
      content:
        "Duolingo has heavily invested in A/B testing, running approximately 2000 tests per year to optimize their product. Recently, they've integrated AI and large language models to accelerate content creation and enable new features like conversational practice with animated characters.",
      startTime: "00:25:00",
      endTime: "00:35:00",
      qa: [
        {
          question: "How does Duolingo use AI?",
          answer:
            "Duolingo uses AI and large language models to create content faster and enable features like conversational practice with animated characters.",
          timestamp: "00:28:00",
          topics: [
            "Artificial Intelligence",
            "Product Features",
            "Content Creation",
          ],
        },
        {
          question: "What role does testing play in development?",
          answer:
            "The company runs about 2000 A/B tests per year to optimize their product and user experience.",
          timestamp: "00:32:00",
          topics: ["Product Development", "Testing", "Optimization"],
        },
      ],
    },
    {
      title: "Brand and Marketing Strategy",
      content:
        "The company's green owl mascot has become a significant marketing asset, driving approximately 15% of new user acquisition through social media presence and memes. The mascot's personality evolved organically through notification messages and community engagement.",
      startTime: "00:35:00",
      endTime: "00:45:00",
      qa: [
        {
          question: "How important is the owl mascot to Duolingo?",
          answer:
            "The owl mascot drives approximately 15% of new user acquisition through social media and has become a valuable marketing asset worth hundreds of millions in earned media.",
          timestamp: "00:38:00",
          topics: ["Marketing", "Brand Identity", "Social Media"],
        },
      ],
    },
  ],
  quickFacts: {
    duration: "45:00",
    participants: ["Ben", "David", "Luis von Ahn"],
    mainTopic: "Education Technology and Business Strategy",
    expertise: "Language Learning and Technology",
  },
};

export const mockPodcastEntities: PodcastEntities = {
  people: [
    {
      name: "Luis von Ahn",
      type: "PERSON",
      context:
        "Co-founder and CEO of Duolingo, former Carnegie Mellon professor",
      mentions: [
        {
          text: "Luis von Ahn shares insights about his background in Guatemala",
          sentiment: "neutral",
          timestamp: "00:05:00",
        },
        {
          text: "Luis explains the decision to delay monetization",
          sentiment: "positive",
          timestamp: "00:20:00",
        },
      ],
      role: "CEO",
      expertise: [
        "Computer Science",
        "Language Learning",
        "Education Technology",
      ],
      affiliations: ["Duolingo", "Carnegie Mellon"],
    },
    {
      name: "Brad Burnham",
      type: "PERSON",
      context: "Partner at Union Square Ventures who joined Duolingo's board",
      mentions: [
        {
          text: "Brad Burnham joined the board after the initial investment",
          sentiment: "neutral",
          timestamp: "00:18:00",
        },
      ],
      role: "Board Member",
      expertise: ["Venture Capital", "Startup Growth"],
      affiliations: ["Union Square Ventures", "Duolingo"],
    },
    {
      name: "Laela Sturdy",
      type: "PERSON",
      context: "Partner at CapitalG who pushed for monetization",
      mentions: [
        {
          text: "Laela Sturdy advocated for implementing the freemium model",
          sentiment: "positive",
          timestamp: "00:22:00",
        },
      ],
      role: "Investor",
      expertise: ["Growth Strategy", "Monetization"],
      affiliations: ["CapitalG"],
    },
  ],
  organizations: [
    {
      name: "Duolingo",
      type: "ORGANIZATION",
      context:
        "Leading language learning platform and education technology company",
      mentions: [
        {
          text: "Duolingo started as a PhD thesis project",
          sentiment: "neutral",
          timestamp: "00:02:00",
        },
        {
          text: "Duolingo reached a $9 billion valuation",
          sentiment: "positive",
          timestamp: "00:25:00",
        },
      ],
      industry: "Education Technology",
      size: "Large",
      location: "Pittsburgh, PA",
    },
    {
      name: "Carnegie Mellon",
      type: "ORGANIZATION",
      context: "University where Duolingo originated as a research project",
      mentions: [
        {
          text: "PhD thesis project at Carnegie Mellon in 2011",
          sentiment: "neutral",
          timestamp: "00:03:00",
        },
      ],
      industry: "Higher Education",
      location: "Pittsburgh, PA",
    },
    {
      name: "Union Square Ventures",
      type: "ORGANIZATION",
      context: "First major investor in Duolingo in 2011",
      mentions: [
        {
          text: "Initial funding from Union Square Ventures",
          sentiment: "positive",
          timestamp: "00:17:00",
        },
      ],
      industry: "Venture Capital",
      location: "New York, NY",
    },
    {
      name: "CapitalG",
      type: "ORGANIZATION",
      context: "Later renamed from Google Capital, invested in Duolingo",
      mentions: [
        {
          text: "CapitalG led the funding round at $500 million valuation",
          sentiment: "positive",
          timestamp: "00:21:00",
        },
      ],
      industry: "Venture Capital",
      location: "Mountain View, CA",
    },
  ],
  locations: [
    {
      name: "Guatemala",
      type: "LOCATION",
      context: "Luis von Ahn's home country, influencing Duolingo's mission",
      mentions: [
        {
          text: "his background in Guatemala influenced Duolingo's mission",
          sentiment: "positive",
          timestamp: "00:06:00",
        },
      ],
      locationType: "Country",
      region: "Central America",
    },
    {
      name: "Pittsburgh",
      type: "LOCATION",
      context: "Home of both Duolingo and Carnegie Mellon",
      mentions: [
        {
          text: "based in Pittsburgh's growing tech scene",
          sentiment: "positive",
          timestamp: "00:04:00",
        },
      ],
      locationType: "City",
      region: "Pennsylvania, USA",
    },
  ],
  events: [
    {
      name: "Duolingo Founding",
      type: "EVENT",
      context: "Initial creation of Duolingo as a PhD project",
      mentions: [
        {
          text: "started as a PhD thesis project in 2011",
          sentiment: "neutral",
          timestamp: "00:02:00",
        },
      ],
      date: "2011",
      participants: ["Luis von Ahn", "Severin Hacker"],
    },
    {
      name: "Initial Funding",
      type: "EVENT",
      context: "First major investment from Union Square Ventures",
      mentions: [
        {
          text: "secured initial funding from Union Square Ventures",
          sentiment: "positive",
          timestamp: "00:17:00",
        },
      ],
      date: "2011",
      participants: ["Luis von Ahn", "Brad Burnham", "Union Square Ventures"],
    },
    {
      name: "Monetization Launch",
      type: "EVENT",
      context: "Implementation of freemium business model",
      mentions: [
        {
          text: "began implementing a freemium model with ads and subscriptions",
          sentiment: "neutral",
          timestamp: "00:22:00",
        },
      ],
      date: "2017",
      participants: ["Luis von Ahn", "Laela Sturdy", "CapitalG"],
    },
  ],
  topics: [
    {
      name: "Language Learning Innovation",
      type: "TOPIC",
      context: "Evolution of language education through technology",
      mentions: [
        {
          text: "transforming how people learn languages globally",
          sentiment: "positive",
          timestamp: "00:10:00",
        },
      ],
      relevance: 1.0,
      subtopics: ["Mobile Learning", "Gamification", "AI Integration"],
    },
    {
      name: "Startup Growth Strategy",
      type: "TOPIC",
      context: "Strategic decisions in company development",
      mentions: [
        {
          text: "focused on user retention before monetization",
          sentiment: "neutral",
          timestamp: "00:20:00",
        },
      ],
      relevance: 0.9,
      subtopics: ["User Retention", "Monetization", "Product Development"],
    },
  ],
  concepts: [
    {
      name: "Gamification",
      type: "CONCEPT",
      context: "Use of game elements in language learning",
      mentions: [
        {
          text: "gamification as a key factor in user engagement",
          sentiment: "positive",
          timestamp: "00:12:00",
        },
      ],
      definition:
        "Application of game-design elements and principles in non-game contexts",
      examples: ["Streak system", "XP points", "Competitive leaderboards"],
    },
    {
      name: "Freemium Model",
      type: "CONCEPT",
      context: "Business model combining free and premium services",
      mentions: [
        {
          text: "implementing a freemium model with ads and subscriptions",
          sentiment: "neutral",
          timestamp: "00:22:00",
        },
      ],
      definition:
        "Business model offering basic features for free while charging for premium features",
      examples: [
        "Ad-supported free tier",
        "Premium subscription",
        "In-app purchases",
      ],
    },
  ],
};

export const mockPodcastTimeline: PodcastTimeline = {
  id: "duolingo-journey-timeline",
  title: "Duolingo's Journey Timeline",
  description:
    "Chronological progression of Duolingo's evolution from academic project to EdTech leader",
  startTime: {
    timestamp: "00:00:00",
    confidence: 1.0,
    isApproximate: false,
    timeContext: "Start of podcast episode",
  },
  endTime: {
    timestamp: "00:45:00",
    confidence: 1.0,
    isApproximate: false,
    timeContext: "End of podcast episode",
  },
  duration: "45:00",
  segments: [
    {
      id: "origins-segment",
      title: "Origins and Early Development",
      description: "The founding and early development phase of Duolingo",
      startTime: {
        timestamp: "00:00:00",
        confidence: 1.0,
        isApproximate: false,
      },
      endTime: {
        timestamp: "00:15:00",
        confidence: 1.0,
        isApproximate: false,
      },
      events: [
        {
          id: "founding-event",
          title: "Duolingo's Academic Origins",
          description: "Initial creation as a PhD project at Carnegie Mellon",
          type: "ACTION",
          time: {
            timestamp: "00:02:00",
            confidence: 0.9,
            isApproximate: false,
          },
          participants: [
            { id: "luis", type: "PERSON", name: "Luis von Ahn" },
            { id: "cmu", type: "ORGANIZATION", name: "Carnegie Mellon" },
          ],
          organizations: [
            { id: "cmu", type: "ORGANIZATION", name: "Carnegie Mellon" },
          ],
          context: "Initial founding of Duolingo as an academic project",
          sourceText: "started as a PhD thesis project in 2011",
          sourceParagraph:
            "Duolingo began as a PhD thesis project at Carnegie Mellon in 2011.",
          sourceConfidence: 1.0,
          confidence: 0.9,
        },
        {
          id: "early-learning",
          title: "Key Product Insight",
          description: "Discovery about optimal lesson length",
          type: "REVELATION",
          time: {
            timestamp: "00:08:00",
            confidence: 0.8,
            isApproximate: true,
          },
          participants: [{ id: "luis", type: "PERSON", name: "Luis von Ahn" }],
          context: "Early product development insights",
          sourceText:
            "30-minute lessons were too long and needed to be shortened",
          sourceParagraph:
            "They discovered that 30-minute lessons were too long and needed to be shortened to 3-minute chunks to improve user engagement and retention.",
          sourceConfidence: 0.9,
          confidence: 0.8,
        },
      ],
      mainTopics: [
        { id: "founding", type: "TOPIC", name: "Company Founding" },
        { id: "product-dev", type: "TOPIC", name: "Product Development" },
      ],
      mainParticipants: [{ id: "luis", type: "PERSON", name: "Luis von Ahn" }],
      summary:
        "The initial phase of Duolingo's development, starting from its academic origins and early product insights.",
    },
    {
      id: "growth-segment",
      title: "Growth and Investment Phase",
      description: "Period of focus on growth and securing investment",
      startTime: {
        timestamp: "00:15:00",
        confidence: 1.0,
        isApproximate: false,
      },
      endTime: {
        timestamp: "00:25:00",
        confidence: 1.0,
        isApproximate: false,
      },
      events: [
        {
          id: "usv-investment",
          title: "Initial Venture Funding",
          description: "First major investment from Union Square Ventures",
          type: "ACTION",
          time: {
            timestamp: "00:17:00",
            confidence: 0.9,
            isApproximate: false,
          },
          participants: [{ id: "brad", type: "PERSON", name: "Brad Burnham" }],
          organizations: [
            { id: "usv", type: "ORGANIZATION", name: "Union Square Ventures" },
          ],
          context: "Securing initial venture capital funding",
          sourceText: "Initial funding from Union Square Ventures",
          sourceParagraph:
            "The company secured initial funding from Union Square Ventures, with Brad Burnham joining the board.",
          sourceConfidence: 0.9,
          confidence: 0.9,
        },
        {
          id: "monetization-decision",
          title: "Monetization Strategy",
          description: "Decision to implement freemium model",
          type: "REVELATION",
          time: {
            timestamp: "00:22:00",
            confidence: 0.9,
            isApproximate: false,
          },
          participants: [{ id: "laela", type: "PERSON", name: "Laela Sturdy" }],
          organizations: [
            { id: "capitalg", type: "ORGANIZATION", name: "CapitalG" },
          ],
          context: "Strategic decision about business model",
          sourceText:
            "implementing a freemium model with ads and subscriptions",
          sourceParagraph:
            "In 2017, they began implementing a freemium model with ads and subscriptions.",
          sourceConfidence: 0.9,
          confidence: 0.9,
        },
      ],
      mainTopics: [
        { id: "growth", type: "TOPIC", name: "Company Growth" },
        { id: "monetization", type: "TOPIC", name: "Monetization Strategy" },
      ],
      mainParticipants: [
        { id: "brad", type: "PERSON", name: "Brad Burnham" },
        { id: "laela", type: "PERSON", name: "Laela Sturdy" },
      ],
      summary:
        "The growth phase focused on securing investment and developing a monetization strategy.",
    },
    {
      id: "product-dev-segment",
      title: "Product Development and AI",
      description: "Focus on product optimization and AI integration",
      startTime: {
        timestamp: "00:25:00",
        confidence: 1.0,
        isApproximate: false,
      },
      endTime: {
        timestamp: "00:35:00",
        confidence: 1.0,
        isApproximate: false,
      },
      events: [
        {
          id: "ai-integration",
          title: "AI Feature Integration",
          description: "Integration of AI and language models",
          type: "ACTION",
          time: {
            timestamp: "00:28:00",
            confidence: 0.9,
            isApproximate: false,
          },
          participants: [],
          context: "Technical advancement in product capabilities",
          sourceText:
            "integrated AI and large language models to accelerate content creation",
          sourceParagraph:
            "Recently, they've integrated AI and large language models to accelerate content creation and enable new features.",
          sourceConfidence: 0.9,
          confidence: 0.9,
        },
        {
          id: "testing-revelation",
          title: "A/B Testing Scale",
          description: "Revelation about testing volume",
          type: "REVELATION",
          time: {
            timestamp: "00:32:00",
            confidence: 0.9,
            isApproximate: false,
          },
          participants: [],
          context: "Product development methodology",
          sourceText: "runs about 2000 A/B tests per year",
          sourceParagraph:
            "The company runs about 2000 A/B tests per year to optimize their product and user experience.",
          sourceConfidence: 0.9,
          confidence: 0.9,
        },
      ],
      mainTopics: [
        { id: "ai", type: "TOPIC", name: "AI Integration" },
        { id: "product", type: "TOPIC", name: "Product Development" },
      ],
      mainParticipants: [],
      summary:
        "Focus on technical advancement through AI integration and rigorous testing methodology.",
    },
    {
      id: "brand-segment",
      title: "Brand and Marketing Evolution",
      description: "Development of brand identity and marketing strategy",
      startTime: {
        timestamp: "00:35:00",
        confidence: 1.0,
        isApproximate: false,
      },
      endTime: {
        timestamp: "00:45:00",
        confidence: 1.0,
        isApproximate: false,
      },
      events: [
        {
          id: "mascot-impact",
          title: "Mascot Marketing Success",
          description: "Impact of owl mascot on user acquisition",
          type: "REVELATION",
          time: {
            timestamp: "00:38:00",
            confidence: 0.9,
            isApproximate: false,
          },
          participants: [],
          context: "Brand and marketing strategy",
          sourceText:
            "owl mascot drives approximately 15% of new user acquisition",
          sourceParagraph:
            "The owl mascot drives approximately 15% of new user acquisition through social media and has become a valuable marketing asset.",
          sourceConfidence: 0.9,
          confidence: 0.9,
        },
      ],
      mainTopics: [
        { id: "brand", type: "TOPIC", name: "Brand Development" },
        { id: "marketing", type: "TOPIC", name: "Marketing Strategy" },
      ],
      mainParticipants: [],
      summary: "Evolution of Duolingo's brand identity and marketing approach.",
    },
  ],
  events: [], // Individual events are contained within segments
  mainParticipants: [
    { id: "luis", type: "PERSON", name: "Luis von Ahn" },
    { id: "brad", type: "PERSON", name: "Brad Burnham" },
    { id: "laela", type: "PERSON", name: "Laela Sturdy" },
  ],
  mainTopics: [
    { id: "growth", type: "TOPIC", name: "Company Growth" },
    { id: "product", type: "TOPIC", name: "Product Development" },
    { id: "ai", type: "TOPIC", name: "AI Integration" },
    { id: "brand", type: "TOPIC", name: "Brand Development" },
  ],
  summary:
    "Chronological progression of Duolingo's journey from an academic project to a leading education technology company, covering key developments in product, growth, and brand strategy.",
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
    title: "Themes",
    href: "#themes",
  },
];
