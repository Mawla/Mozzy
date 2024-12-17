import { ProcessedPodcast } from "@/app/types/podcast";

export const mockPodcastResults: ProcessedPodcast = {
  id: "1",
  title: "Language Learning with Duolingo",
  summary:
    "An insightful discussion about language learning methodologies, gamification in education, and how Duolingo has revolutionized language acquisition through technology.",
  keyPoints: [
    "Spaced repetition enhances language retention",
    "Gamification increases user engagement",
    "Adaptive learning personalizes the experience",
    "Multiple language families are supported",
  ],
  topics: [
    {
      id: "learning-model",
      title: "Duolingo Learning Model",
      content:
        "Comprehensive analysis of Duolingo's innovative approach to language learning, combining gamification, adaptive algorithms, and social features to create an engaging and effective learning experience. The platform emphasizes active language engagement through brief, focused lessons and a variety of interactive exercises.",
      metadata: {
        timestamp: "00:05:30",
        relevanceScore: 0.98,
        relatedTopics: [
          "Gamification",
          "Adaptive Learning",
          "Social Features",
          "User Engagement",
        ],
      },
      subtopics: [
        {
          id: "core-methodology",
          title: "Core Learning Methodology",
          content:
            "Duolingo's fundamental approach centers on direct language engagement where users learn through practical application. The platform employs a gamified methodology with lessons incorporating translation exercises, interactive quizzes, and immersive stories. Lessons are intentionally designed to be brief and manageable, allowing users to learn in digestible chunks while maintaining consistent engagement. This structured approach ensures steady progress while preventing cognitive overload.",
          metadata: {
            timestamp: "00:07:45",
            relevanceScore: 0.96,
          },
        },
        {
          id: "adaptive-system",
          title: "Adaptive Learning Technology",
          content:
            "At the heart of Duolingo's personalization is a sophisticated adaptive algorithm system. The platform implements a personalized bandit algorithm, later enhanced with an A/B tested variant recovering difference softmax algorithm, which dynamically adjusts to each learner's performance patterns. This system serves multiple functions: it personalizes the learning path, provides targeted feedback and recommendations, and optimizes the timing of daily notifications to maximize user engagement. The algorithm continuously analyzes user performance to adjust difficulty and content presentation.",
          metadata: {
            timestamp: "00:12:20",
            relevanceScore: 0.95,
          },
        },
        {
          id: "competitive-features",
          title: "Competitive Learning Environment",
          content:
            "Duolingo creates an engaging competitive space through its Leagues system, where users compete in groups of up to 30 randomly selected participants worldwide. The platform uses experience points (XP) to determine weekly rankings within these leagues, fostering healthy competition. Users can personalize their experience with custom avatars and engage in direct competition through Duolingo Clash. The achievement system awards badges for completing specific objectives, adding another layer of motivation and recognition. This competitive framework helps maintain long-term engagement while encouraging consistent practice.",
          metadata: {
            timestamp: "00:15:30",
            relevanceScore: 0.94,
          },
        },
        {
          id: "engagement-systems",
          title: "Engagement and Retention Features",
          content:
            "The platform employs multiple mechanisms to maintain user engagement, with the streak system being a central feature. This includes a comprehensive widget system that originated as a hackathon project, featuring 39 unique illustrations by Kyle Ruane that show Duo's varying moods throughout the day. The streak feature, symbolized by a fire icon, tracks daily lesson completion and extends to social interaction through the Friend Streak feature, allowing users to maintain streaks with up to five friends simultaneously. These widgets appear on both iOS and Android platforms, serving as visual reminders and motivation for daily practice.",
          metadata: {
            timestamp: "00:18:45",
            relevanceScore: 0.93,
          },
        },
        {
          id: "exercise-variety",
          title: "Learning Exercise Types",
          content:
            "Duolingo offers a diverse range of exercise types to maintain engagement and ensure comprehensive language acquisition. These include translation tasks, listening comprehension exercises, speaking practice sessions, and interactive stories. Each exercise type is carefully calibrated to reinforce different aspects of language learning while maintaining user engagement through variety and progressive difficulty. The platform's adaptive system ensures that these exercises are presented in an optimal sequence based on the user's learning patterns and performance.",
          metadata: {
            timestamp: "00:21:00",
            relevanceScore: 0.92,
          },
        },
      ],
    },
    {
      id: "course-structure",
      title: "Course Design Principles",
      content: "Examination of effective language course structuring",
      metadata: {
        timestamp: "00:30:15",
        relevanceScore: 0.9,
        relatedTopics: ["Curriculum Design", "Skill Progression", "Assessment"],
      },
      subtopics: [
        {
          id: "progression",
          title: "Skill Progression",
          content: "Building language skills through structured advancement",
          metadata: {
            timestamp: "00:35:00",
            relevanceScore: 0.87,
          },
        },
        {
          id: "assessment",
          title: "Progress Assessment",
          content: "Methods for evaluating language learning progress",
          metadata: {
            timestamp: "00:42:15",
            relevanceScore: 0.85,
          },
        },
      ],
    },
    {
      id: "motivation",
      title: "Learner Motivation",
      content: "Strategies for maintaining learning momentum",
      metadata: {
        timestamp: "01:00:00",
        relevanceScore: 0.93,
        relatedTopics: ["Streaks", "Achievements", "Social Learning"],
      },
      subtopics: [
        {
          id: "achievements",
          title: "Achievement Systems",
          content: "Using goals and rewards to maintain engagement",
          metadata: {
            timestamp: "01:05:30",
            relevanceScore: 0.89,
          },
        },
        {
          id: "social",
          title: "Social Learning Features",
          content: "Incorporating community and competition in learning",
          metadata: {
            timestamp: "01:15:45",
            relevanceScore: 0.86,
          },
        },
      ],
    },
  ],
  metrics: [
    {
      label: "Active Users",
      value: "100M+",
    },
    {
      label: "Available Languages",
      value: 44,
    },
    {
      label: "Learning Features",
      value: 12,
    },
    {
      label: "Exercise Types",
      value: 8,
    },
    {
      label: "Success Rate",
      value: "89%",
    },
    {
      label: "User Engagement",
      value: "15M",
    },
  ],
  themes: [
    {
      name: "Modern Learning Methods",
      description: "Analysis of contemporary language learning approaches",
      relatedConcepts: [
        "interactive learning",
        "gamification",
        "adaptive systems",
        "personalization",
      ],
      relevance: 0.95,
    },
    {
      name: "Educational Technology",
      description: "Role of technology in language education",
      relatedConcepts: [
        "mobile learning",
        "AI adaptation",
        "progress tracking",
        "instant feedback",
      ],
      relevance: 0.9,
    },
    {
      name: "User Engagement",
      description: "Strategies for maintaining learner motivation",
      relatedConcepts: [
        "achievements",
        "social features",
        "streaks",
        "rewards",
      ],
      relevance: 0.88,
    },
  ],
  people: ["Luis von Ahn", "Severin Hacker", "Language Learning Experts"],
  organizations: [
    "Duolingo",
    "Language Learning Institute",
    "Cultural Exchange Program",
  ],
  locations: ["Pittsburgh", "Global Learning Centers", "Language Labs"],
  events: [
    "Language Summit 2023",
    "Cultural Exchange Event",
    "Learning Workshop",
  ],
  timeline: [
    {
      title: "Basic Language Skills",
      description: "Foundation of language learning",
      date: "00:00:00",
      type: "milestone",
      importance: "high",
    },
    {
      title: "Grammar Deep Dive",
      description: "Essential grammar structures",
      date: "00:30:00",
      type: "event",
      importance: "medium",
    },
    {
      title: "Cultural Context",
      description: "Understanding language in cultural context",
      date: "01:00:00",
      type: "milestone",
      importance: "high",
    },
  ],
  quickFacts: {
    duration: "1h 30m",
    participants: [
      "Language Experts",
      "Cultural Advisors",
      "Education Specialists",
    ],
    mainTopic: "Language Learning and Cultural Understanding",
    expertise: "Language Education and Technology",
  },
  sections: [
    {
      title: "Introduction to Language Learning",
      content: "Overview of effective language learning methods",
      startTime: "00:00:00",
      endTime: "00:15:00",
      qa: [
        {
          question: "What are the key principles of language acquisition?",
          answer: "Consistent practice, immersion, and contextual learning",
          context: "Discussion of learning methodologies",
          topics: ["learning", "methodology", "practice"],
        },
      ],
    },
    {
      title: "Grammar and Structure",
      content: "Essential grammar concepts across languages",
      startTime: "00:15:00",
      endTime: "00:45:00",
      qa: [
        {
          question: "How do different languages structure their sentences?",
          answer: "Explanation of basic sentence structures and word order",
          context: "Grammar fundamentals section",
          topics: ["grammar", "syntax", "structure"],
        },
      ],
    },
  ],
};
