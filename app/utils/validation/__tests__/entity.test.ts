import {
  createEntity,
  validateEntity,
  updateEntity,
  validateEntities,
  createEntities,
} from "../entity";
import type { ValidatedPodcastEntity } from "@/app/types/entities/podcast";

describe("Entity Validation Utilities", () => {
  const baseEntityData = {
    name: "Test Entity",
    context: "Test context",
    mentions: [
      {
        text: "Test mention",
        sentiment: "positive" as const,
        timestamp: "2025-01-20T09:14:00Z",
      },
    ],
  };

  describe("createEntity", () => {
    it("should create a valid person entity", () => {
      const personData = {
        ...baseEntityData,
        expertise: ["AI"],
        role: "Researcher",
      };

      const person = createEntity(personData, "PERSON");
      expect(person.type).toBe("PERSON");
      expect(person.id).toBeDefined();
      expect(person.createdAt).toBeDefined();
      expect(person.updatedAt).toBeDefined();
      expect(person.expertise).toEqual(["AI"]);
      expect(person.role).toBe("Researcher");
    });

    it("should create a valid organization entity", () => {
      const orgData = {
        ...baseEntityData,
        industry: "Technology",
        size: "Large",
      };

      const org = createEntity(orgData, "ORGANIZATION");
      expect(org.type).toBe("ORGANIZATION");
      expect(org.industry).toBe("Technology");
      expect(org.size).toBe("Large");
    });

    it("should throw error for invalid entity data", () => {
      const invalidData = {
        ...baseEntityData,
        expertise: [], // Empty expertise array is invalid
        role: "Researcher",
      };

      expect(() => createEntity(invalidData, "PERSON")).toThrow();
    });
  });

  describe("validateEntity", () => {
    it("should validate a correct entity", () => {
      const person = createEntity(
        {
          ...baseEntityData,
          expertise: ["AI"],
          role: "Researcher",
        },
        "PERSON"
      );

      expect(() => validateEntity(person)).not.toThrow();
    });

    it("should throw error for invalid entity", () => {
      const invalidPerson = createEntity(
        {
          ...baseEntityData,
          expertise: ["AI"],
          role: "Researcher",
        },
        "PERSON"
      );

      // @ts-expect-error Testing invalid entity
      delete invalidPerson.expertise;

      expect(() => validateEntity(invalidPerson)).toThrow();
    });
  });

  describe("updateEntity", () => {
    it("should update and validate entity", () => {
      const person = createEntity(
        {
          ...baseEntityData,
          expertise: ["AI"],
          role: "Researcher",
        },
        "PERSON"
      );

      const updated = updateEntity(person, {
        role: "Senior Researcher",
        expertise: ["AI", "Machine Learning"],
      });

      expect(updated.role).toBe("Senior Researcher");
      expect(updated.expertise).toEqual(["AI", "Machine Learning"]);
      expect(updated.updatedAt).not.toBe(person.updatedAt);
    });

    it("should throw error for invalid updates", () => {
      const person = createEntity(
        {
          ...baseEntityData,
          expertise: ["AI"],
          role: "Researcher",
        },
        "PERSON"
      );

      expect(() =>
        updateEntity(person, {
          // @ts-expect-error Testing invalid update
          expertise: [], // Empty expertise array is invalid
        })
      ).toThrow();
    });
  });

  describe("validateEntities", () => {
    it("should validate array of entities", () => {
      const entities = [
        createEntity(
          {
            ...baseEntityData,
            expertise: ["AI"],
            role: "Researcher",
          },
          "PERSON"
        ),
        createEntity(
          {
            ...baseEntityData,
            industry: "Tech",
            size: "Large",
          },
          "ORGANIZATION"
        ),
      ];

      expect(() => validateEntities(entities)).not.toThrow();
    });

    it("should throw error if any entity is invalid", () => {
      const entities = [
        createEntity(
          {
            ...baseEntityData,
            expertise: ["AI"],
            role: "Researcher",
          },
          "PERSON"
        ),
        createEntity(
          {
            ...baseEntityData,
            industry: "Tech",
            size: "Large",
          },
          "ORGANIZATION"
        ),
      ];

      // @ts-expect-error Testing invalid entity
      delete entities[0].expertise;

      expect(() => validateEntities(entities)).toThrow();
    });
  });

  describe("createEntities", () => {
    it("should create multiple entities of the same type", () => {
      const peopleData = [
        {
          ...baseEntityData,
          expertise: ["AI"],
          role: "Researcher",
        },
        {
          ...baseEntityData,
          expertise: ["ML"],
          role: "Engineer",
        },
      ];

      const people = createEntities(peopleData, "PERSON");
      expect(people).toHaveLength(2);
      expect(people[0].type).toBe("PERSON");
      expect(people[1].type).toBe("PERSON");
      expect(people[0].expertise).toEqual(["AI"]);
      expect(people[1].expertise).toEqual(["ML"]);
    });

    it("should throw error if any entity data is invalid", () => {
      const peopleData = [
        {
          ...baseEntityData,
          expertise: ["AI"],
          role: "Researcher",
        },
        {
          ...baseEntityData,
          expertise: [], // Invalid: empty expertise array
          role: "Engineer",
        },
      ];

      expect(() => createEntities(peopleData, "PERSON")).toThrow();
    });
  });
});
