import type {
  ProcessingStatus,
  ProcessingResult,
  ProcessingAnalysis,
  TimelineEvent,
  TopicAnalysis,
  SentimentAnalysis,
  ProcessingMetadata,
} from "@/app/types/processing/base";
import {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
} from "@/app/types/entities/podcast";
import { KeyPoint, QuickFact } from "@/app/types/podcast/processing";
import type { PodcastProcessingChunk } from "@/app/types/processing/podcast/types";

const now = new Date().toISOString();

export const mockPodcastResults: ProcessingResult = {
  id: "1",
  status: "completed" as ProcessingStatus,
  success: true,
  format: "podcast",
  transcript: `In this episode, we explore how Duolingo revolutionized language learning through technology and gamification...`,
  output: `A comprehensive analysis of Duolingo's innovative approach to language learning...`,
  metadata: {
    format: "podcast",
    platform: "web",
    processedAt: now,
    title: "Language Learning with Duolingo",
    duration: "45:00",
    speakers: ["Luis von Ahn", "Jane Smith"],
    topics: ["Language Learning", "EdTech", "Gamification"],
  } as ProcessingMetadata,
  analysis: {
    title: "Language Learning with Duolingo",
    summary:
      "An insightful discussion about language learning methodologies, gamification in education, and how Duolingo has revolutionized language acquisition through technology.",
    quickFacts: {
      duration: "45:00",
      participants: ["Luis von Ahn", "Jane Smith"],
      mainTopic: "Language Learning Technology",
      expertise: "EdTech",
    } as QuickFact,
    keyPoints: [
      {
        title: "Spaced Repetition",
        description: "Spaced repetition enhances language retention",
        relevance: "high",
      } as KeyPoint,
      {
        title: "Gamification",
        description: "Gamification increases user engagement",
        relevance: "high",
      } as KeyPoint,
      {
        title: "Adaptive Learning",
        description: "Adaptive learning personalizes the experience",
        relevance: "high",
      } as KeyPoint,
    ],
    topics: [
      {
        name: "Language Learning",
        confidence: 0.98,
        keywords: ["spaced repetition", "immersion", "vocabulary"],
      },
      {
        name: "Gamification",
        confidence: 0.95,
        keywords: ["rewards", "streaks", "points"],
      },
      {
        name: "EdTech",
        confidence: 0.92,
        keywords: ["adaptive learning", "technology", "education"],
      },
    ] as TopicAnalysis[],
    sentiment: {
      overall: 0.8,
      segments: [
        {
          text: "Revolutionary approach to language learning",
          score: 0.9,
        },
        {
          text: "Challenges in user retention",
          score: 0.6,
        },
      ],
    } as SentimentAnalysis,
  } as ProcessingAnalysis,
  entities: {
    people: [
      {
        id: "1",
        type: "PERSON",
        name: "Luis von Ahn",
        role: "CEO",
        expertise: ["Computer Science", "Language Learning"],
        affiliations: ["Duolingo", "Carnegie Mellon University"],
        createdAt: now,
        updatedAt: now,
        context: "Speaker",
        mentions: [],
      } as PersonEntity,
      {
        id: "2",
        type: "PERSON",
        name: "Jane Smith",
        role: "Host",
        expertise: ["EdTech", "Podcasting"],
        affiliations: ["Tech Talk Radio"],
        createdAt: now,
        updatedAt: now,
        context: "Host",
        mentions: [],
      } as PersonEntity,
    ],
    organizations: [
      {
        id: "3",
        type: "ORGANIZATION",
        name: "Duolingo",
        industry: "EdTech",
        size: "Large",
        location: "Pittsburgh, PA",
        createdAt: now,
        updatedAt: now,
        context: "Company",
        mentions: [],
      } as OrganizationEntity,
    ],
    locations: [],
    events: [
      {
        id: "7",
        type: "EVENT",
        name: "Duolingo Podcast Interview",
        date: now,
        duration: "45:00",
        participants: ["Luis von Ahn", "Jane Smith"],
        createdAt: now,
        updatedAt: now,
        context: "Interview",
        mentions: [],
      } as EventEntity,
    ],
    topics: [
      {
        id: "4",
        type: "TOPIC",
        name: "Language Learning",
        relevance: 0.98,
        subtopics: ["Vocabulary", "Grammar", "Pronunciation"],
        category: "Education",
        createdAt: now,
        updatedAt: now,
        context: "Main Topic",
        mentions: [],
      } as TopicEntity,
      {
        id: "5",
        type: "TOPIC",
        name: "Gamification",
        relevance: 0.95,
        subtopics: ["Rewards", "Streaks", "Points"],
        category: "Product Features",
        createdAt: now,
        updatedAt: now,
        context: "Feature",
        mentions: [],
      } as TopicEntity,
    ],
    concepts: [
      {
        id: "6",
        type: "CONCEPT",
        name: "Spaced Repetition",
        definition:
          "A learning technique that incorporates increasing intervals of time between subsequent review of previously learned material",
        examples: ["Duolingo's review system", "Vocabulary practice intervals"],
        domain: "Learning Science",
        createdAt: now,
        updatedAt: now,
        context: "Learning Method",
        mentions: [],
      } as ConceptEntity,
    ],
  },
  timeline: [
    {
      timestamp: "00:00:00",
      event: "Introduction",
      speakers: ["Jane Smith"],
      topics: ["Language Learning"],
    } as TimelineEvent,
    {
      timestamp: "00:15:00",
      event: "Gamification Discussion",
      speakers: ["Luis von Ahn"],
      topics: ["Gamification", "User Engagement"],
    } as TimelineEvent,
    {
      timestamp: "00:30:00",
      event: "Future of EdTech",
      speakers: ["Luis von Ahn", "Jane Smith"],
      topics: ["EdTech", "Innovation"],
    } as TimelineEvent,
  ],
};

export const mockPodcastChunks: PodcastProcessingChunk[] = [
  {
    id: "chunk-1",
    text: "Welcome to the AI Ethics Podcast...",
    status: "completed",
    progress: 100,
    start: 0,
    end: 120,
    startIndex: 0,
    endIndex: 150,
    result: {
      id: "chunk-1-result",
      text: "Welcome to the AI Ethics Podcast...",
      refinedText: "Welcome to the AI Ethics Podcast...",
      status: "completed",
      progress: 100,
      entities: {
        people: [],
        organizations: [],
        locations: [],
        events: [],
        topics: [],
        concepts: [],
      },
    },
  },
  {
    id: "chunk-2",
    text: "Today we're discussing...",
    status: "completed",
    progress: 100,
    start: 121,
    end: 240,
    startIndex: 151,
    endIndex: 300,
    result: {
      id: "chunk-2-result",
      text: "Today we're discussing...",
      refinedText: "Today we're discussing...",
      status: "completed",
      progress: 100,
      entities: {
        people: [],
        organizations: [],
        locations: [],
        events: [],
        topics: [],
        concepts: [],
      },
    },
  },
];
