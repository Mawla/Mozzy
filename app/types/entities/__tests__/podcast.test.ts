import {
  personEntitySchema,
  organizationEntitySchema,
  locationEntitySchema,
  eventEntitySchema,
  topicEntitySchema,
  conceptEntitySchema,
  podcastEntitySchema,
} from "../podcast";

describe("Podcast Entity Validation", () => {
  const baseEntity = {
    id: "test-id",
    name: "Test Entity",
    context: "Test context",
    mentions: [
      {
        text: "Test mention",
        sentiment: "positive" as const,
        timestamp: "2025-01-20T09:14:00Z",
      },
    ],
    createdAt: "2025-01-20T09:14:00Z",
    updatedAt: "2025-01-20T09:14:00Z",
  };

  describe("PersonEntity", () => {
    const validPerson = {
      ...baseEntity,
      type: "PERSON" as const,
      expertise: ["AI", "Machine Learning"],
      role: "Researcher",
    };

    it("should validate a correct person entity", () => {
      expect(() => personEntitySchema.parse(validPerson)).not.toThrow();
    });

    it("should require expertise array", () => {
      const invalidPerson = { ...validPerson, expertise: [] };
      expect(() => personEntitySchema.parse(invalidPerson)).toThrow();
    });

    it("should require non-empty role", () => {
      const invalidPerson = { ...validPerson, role: "" };
      expect(() => personEntitySchema.parse(invalidPerson)).toThrow();
    });
  });

  describe("OrganizationEntity", () => {
    const validOrg = {
      ...baseEntity,
      type: "ORGANIZATION" as const,
      industry: "Technology",
      size: "Large",
    };

    it("should validate a correct organization entity", () => {
      expect(() => organizationEntitySchema.parse(validOrg)).not.toThrow();
    });

    it("should require non-empty industry", () => {
      const invalidOrg = { ...validOrg, industry: "" };
      expect(() => organizationEntitySchema.parse(invalidOrg)).toThrow();
    });

    it("should require non-empty size", () => {
      const invalidOrg = { ...validOrg, size: "" };
      expect(() => organizationEntitySchema.parse(invalidOrg)).toThrow();
    });
  });

  describe("LocationEntity", () => {
    const validLocation = {
      ...baseEntity,
      type: "LOCATION" as const,
      locationType: "City",
      coordinates: { lat: 40.7128, lng: -74.006 },
    };

    it("should validate a correct location entity", () => {
      expect(() => locationEntitySchema.parse(validLocation)).not.toThrow();
    });

    it("should validate without coordinates", () => {
      const locationWithoutCoords = {
        ...baseEntity,
        type: "LOCATION" as const,
        locationType: "City",
      };
      expect(() =>
        locationEntitySchema.parse(locationWithoutCoords)
      ).not.toThrow();
    });

    it("should validate coordinates within bounds", () => {
      const invalidLocation = {
        ...validLocation,
        coordinates: { lat: 100, lng: 200 },
      };
      expect(() => locationEntitySchema.parse(invalidLocation)).toThrow();
    });
  });

  describe("EventEntity", () => {
    const validEvent = {
      ...baseEntity,
      type: "EVENT" as const,
      date: "2025-01-20",
      duration: "2 hours",
      participants: ["John Doe", "Jane Smith"],
    };

    it("should validate a correct event entity", () => {
      expect(() => eventEntitySchema.parse(validEvent)).not.toThrow();
    });

    it("should require valid date format", () => {
      const invalidEvent = { ...validEvent, date: "20-01-2025" };
      expect(() => eventEntitySchema.parse(invalidEvent)).toThrow();
    });

    it("should require at least one participant", () => {
      const invalidEvent = { ...validEvent, participants: [] };
      expect(() => eventEntitySchema.parse(invalidEvent)).toThrow();
    });
  });

  describe("TopicEntity", () => {
    const validTopic = {
      ...baseEntity,
      type: "TOPIC" as const,
      subtopics: ["Subtopic 1", "Subtopic 2"],
      examples: ["Example 1", "Example 2"],
    };

    it("should validate a correct topic entity", () => {
      expect(() => topicEntitySchema.parse(validTopic)).not.toThrow();
    });

    it("should require at least one subtopic", () => {
      const invalidTopic = { ...validTopic, subtopics: [] };
      expect(() => topicEntitySchema.parse(invalidTopic)).toThrow();
    });

    it("should require at least one example", () => {
      const invalidTopic = { ...validTopic, examples: [] };
      expect(() => topicEntitySchema.parse(invalidTopic)).toThrow();
    });
  });

  describe("ConceptEntity", () => {
    const validConcept = {
      ...baseEntity,
      type: "CONCEPT" as const,
      definition: "A clear definition",
      examples: ["Example 1", "Example 2"],
    };

    it("should validate a correct concept entity", () => {
      expect(() => conceptEntitySchema.parse(validConcept)).not.toThrow();
    });

    it("should require non-empty definition", () => {
      const invalidConcept = { ...validConcept, definition: "" };
      expect(() => conceptEntitySchema.parse(invalidConcept)).toThrow();
    });

    it("should require at least one example", () => {
      const invalidConcept = { ...validConcept, examples: [] };
      expect(() => conceptEntitySchema.parse(invalidConcept)).toThrow();
    });
  });

  describe("Combined Entity Validation", () => {
    it("should validate all entity types", () => {
      const entities = [
        {
          ...baseEntity,
          type: "PERSON" as const,
          expertise: ["AI"],
          role: "Researcher",
        },
        {
          ...baseEntity,
          type: "ORGANIZATION" as const,
          industry: "Tech",
          size: "Large",
        },
        {
          ...baseEntity,
          type: "LOCATION" as const,
          locationType: "City",
        },
        {
          ...baseEntity,
          type: "EVENT" as const,
          date: "2025-01-20",
          duration: "2h",
          participants: ["John"],
        },
        {
          ...baseEntity,
          type: "TOPIC" as const,
          subtopics: ["Sub"],
          examples: ["Ex"],
        },
        {
          ...baseEntity,
          type: "CONCEPT" as const,
          definition: "Def",
          examples: ["Ex"],
        },
      ];

      entities.forEach((entity) => {
        expect(() => podcastEntitySchema.parse(entity)).not.toThrow();
      });
    });

    it("should reject invalid entity types", () => {
      const invalidEntity = {
        ...baseEntity,
        type: "INVALID" as const,
      };

      expect(() => podcastEntitySchema.parse(invalidEntity)).toThrow();
    });
  });
});
