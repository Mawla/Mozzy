import {
  createValidatedEntity,
  mergePodcastEntities,
  contentToProcessingAnalysis,
  themeToTopicAnalysis,
  sectionToTimelineEvent,
} from "../entity";
import type {
  Theme,
  ContentAnalysis,
  Section,
} from "@/app/schemas/podcast/analysis";
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities/podcast";

describe("Type Conversion Utilities", () => {
  describe("createValidatedEntity", () => {
    it("creates a person entity with required fields", () => {
      const person = createValidatedEntity<PersonEntity>("John Doe", "PERSON");
      expect(person).toMatchObject({
        type: "PERSON",
        name: "John Doe",
        role: "speaker",
        mentions: [],
      });
      expect(person.id).toBeDefined();
      expect(person.createdAt).toBeDefined();
      expect(person.updatedAt).toBeDefined();
    });

    it("creates an organization entity with required fields", () => {
      const org = createValidatedEntity<OrganizationEntity>(
        "Acme Corp",
        "ORGANIZATION"
      );
      expect(org).toMatchObject({
        type: "ORGANIZATION",
        name: "Acme Corp",
        industry: "unknown",
        mentions: [],
      });
      expect(org.id).toBeDefined();
      expect(org.createdAt).toBeDefined();
      expect(org.updatedAt).toBeDefined();
    });

    it("creates a topic entity with required fields", () => {
      const topic = createValidatedEntity<TopicEntity>("AI", "TOPIC");
      expect(topic).toMatchObject({
        type: "TOPIC",
        name: "AI",
        relevance: 1,
        mentions: [],
      });
      expect(topic.id).toBeDefined();
      expect(topic.createdAt).toBeDefined();
      expect(topic.updatedAt).toBeDefined();
    });
  });

  describe("mergePodcastEntities", () => {
    it("merges arrays of entities removing duplicates by ID", () => {
      const person1 = createValidatedEntity<PersonEntity>("John Doe", "PERSON");
      const person2 = createValidatedEntity<PersonEntity>("Jane Doe", "PERSON");
      const org1 = createValidatedEntity<OrganizationEntity>(
        "Acme Corp",
        "ORGANIZATION"
      );

      const entities1: ValidatedPodcastEntities = {
        people: [person1],
        organizations: [org1],
        locations: [],
        events: [],
        topics: [],
        concepts: [],
      };

      const entities2: ValidatedPodcastEntities = {
        people: [person2],
        organizations: [org1], // Same org
        locations: [],
        events: [],
        topics: [],
        concepts: [],
      };

      const merged = mergePodcastEntities([entities1, entities2]);
      expect(merged.people).toHaveLength(2);
      expect(merged.organizations).toHaveLength(1); // Deduplicated
    });
  });

  describe("contentToProcessingAnalysis", () => {
    it("converts content analysis to processing analysis", () => {
      const theme: Theme = {
        name: "AI",
        description: "Artificial Intelligence",
        relatedConcepts: ["ML", "Deep Learning"],
        relevance: 0.9,
      };

      const section: Section = {
        title: "Introduction",
        content: "Content here",
        startTime: "00:00",
        endTime: "01:00",
      };

      const contentAnalysis: ContentAnalysis = {
        title: "Test Title",
        summary: "Test Summary",
        keyPoints: ["Point 1", "Point 2"],
        themes: [theme],
        sections: [section],
        quickFacts: {
          duration: "1 hour",
          participants: ["John", "Jane"],
          mainTopic: "AI",
          expertise: "Advanced",
        },
      };

      const result = contentToProcessingAnalysis(contentAnalysis);
      expect(result).toMatchObject({
        title: "Test Title",
        summary: "Test Summary",
        topics: [
          {
            name: "AI",
            confidence: 0.9,
            keywords: ["ML", "Deep Learning"],
          },
        ],
        timeline: [
          {
            timestamp: "00:00",
            event: "Introduction",
            time: "01:00",
          },
        ],
      });
    });
  });

  describe("themeToTopicAnalysis", () => {
    it("converts theme to topic analysis", () => {
      const theme: Theme = {
        name: "AI",
        description: "Artificial Intelligence",
        relatedConcepts: ["ML", "Deep Learning"],
        relevance: 0.9,
      };

      const result = themeToTopicAnalysis(theme);
      expect(result).toMatchObject({
        name: "AI",
        confidence: 0.9,
        keywords: ["ML", "Deep Learning"],
      });
    });
  });

  describe("sectionToTimelineEvent", () => {
    it("converts section to timeline event", () => {
      const section: Section = {
        title: "Introduction",
        content: "Content here",
        startTime: "00:00",
        endTime: "01:00",
      };

      const result = sectionToTimelineEvent(section);
      expect(result).toMatchObject({
        timestamp: "00:00",
        event: "Introduction",
        time: "01:00",
        speakers: [],
        topics: [],
      });
    });

    it("handles missing timestamps", () => {
      const section: Section = {
        title: "Introduction",
        content: "Content here",
      };

      const result = sectionToTimelineEvent(section);
      expect(result).toMatchObject({
        timestamp: "",
        event: "Introduction",
        time: undefined,
        speakers: [],
        topics: [],
      });
    });
  });
});
