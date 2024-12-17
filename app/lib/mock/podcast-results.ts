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
      title: "Interactive Learning Approach",
      content:
        "Comprehensive analysis of Duolingo's core learning methodology, where users learn through active engagement with language in brief, focused lessons that incorporate multiple learning modalities",
      metadata: {
        timestamp: "00:05:30",
        relevanceScore: 0.95,
        relatedTopics: [
          "Gamification",
          "Spaced Repetition",
          "Adaptive Learning",
          "Interactive Exercises",
        ],
      },
      subtopics: [
        {
          id: "core-methodology",
          title: "Core Learning Methodology",
          content:
            "Users learn through direct language engagement, completing lessons with practical words and phrases. The platform combines translating exercises, interactive quizzes, and immersive stories to create a comprehensive learning experience. Each lesson is intentionally brief to facilitate manageable, consistent learning sessions.",
          metadata: {
            timestamp: "00:07:45",
            relevanceScore: 0.94,
          },
        },
        {
          id: "adaptive-system",
          title: "Adaptive Learning Algorithm",
          content:
            "Implementation of a sophisticated personalized bandit algorithm system, later enhanced with A/B tested variant recovering difference softmax algorithm. This system dynamically adjusts to each learner's performance, providing personalized feedback and recommendations while optimizing daily notification timing for maximum engagement.",
          metadata: {
            timestamp: "00:12:20",
            relevanceScore: 0.93,
          },
        },
        {
          id: "competitive-learning",
          title: "Competitive Learning Environment",
          content:
            "Robust competitive framework featuring Leagues where users compete in groups of up to 30 randomly selected worldwide participants. Rankings are determined by weekly XP (experience points) accumulation. Users can personalize their experience with custom avatars and engage in direct competition through Duolingo Clash. Achievement badges are awarded for completing specific objectives, adding another layer of motivation.",
          metadata: {
            timestamp: "00:15:30",
            relevanceScore: 0.92,
          },
        },
        {
          id: "engagement-features",
          title: "Engagement and Retention Features",
          content:
            "Comprehensive streak system integrated with platform widgets, including 39 unique illustrations by Kyle Ruane showing Duo's varying moods throughout the day. The streak feature, symbolized by a fire icon, tracks daily lesson completion and extends to social interaction through Friend Streak, allowing users to maintain streaks with up to five friends simultaneously.",
          metadata: {
            timestamp: "00:18:45",
            relevanceScore: 0.91,
          },
        },
        {
          id: "exercise-types",
          title: "Exercise Variety",
          content:
            "Diverse range of exercise types including translation tasks, listening comprehension, speaking practice, and interactive stories. Each exercise type is carefully designed to reinforce different aspects of language learning while maintaining user engagement through variety and progressive difficulty.",
          metadata: {
            timestamp: "00:21:00",
            relevanceScore: 0.9,
          },
        },
      ],
    },
    {
      id: "engagement-mechanics",
      title: "Core Learning Mechanics",
      content:
        "Comprehensive analysis of Duolingo's learning methodology and engagement systems",
      metadata: {
        timestamp: "00:15:00",
        relevanceScore: 0.96,
        relatedTopics: [
          "Daily Streaks",
          "Competitive Learning",
          "Adaptive Algorithms",
          "User Engagement",
        ],
      },
      subtopics: [
        {
          id: "lesson-structure",
          title: "Lesson Design",
          content:
            "Brief, focused lessons incorporating translation, interactive exercises, quizzes, and stories for effective language acquisition",
          metadata: {
            timestamp: "00:17:30",
            relevanceScore: 0.94,
          },
        },
        {
          id: "adaptive-algorithms",
          title: "Smart Learning Systems",
          content:
            "Implementation of personalized bandit algorithms and A/B tested variant recovering difference softmax algorithm for optimized learning paths",
          metadata: {
            timestamp: "00:20:45",
            relevanceScore: 0.93,
          },
        },
        {
          id: "competitive-features",
          title: "Competition and Leagues",
          content:
            "Worldwide competitive leagues with 30-user groups, XP-based rankings, and achievement systems through badges",
          metadata: {
            timestamp: "00:23:15",
            relevanceScore: 0.91,
          },
        },
        {
          id: "streak-system",
          title: "Streak Mechanics",
          content:
            "Daily streak system with widget integration, featuring 39 mood-based illustrations and Friend Streak functionality for up to 5 friends",
          metadata: {
            timestamp: "00:25:30",
            relevanceScore: 0.9,
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
