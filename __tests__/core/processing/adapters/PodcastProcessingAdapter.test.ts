import { PodcastProcessingAdapter } from "@/app/core/processing/adapters/podcast";
import type {
  ProcessingOptions,
  ProcessingStatus,
  BaseProcessingResult,
  ProcessingMetadata,
  ProcessingAnalysis,
  SentimentAnalysis,
} from "@/app/core/processing/types/base";
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  ConceptEntity,
} from "@/app/types/entities/podcast";

describe("PodcastProcessingAdapter", () => {
  let adapter: PodcastProcessingAdapter;

  beforeEach(() => {
    adapter = new PodcastProcessingAdapter();
  });

  describe("validate", () => {
    it("should return false for empty input", async () => {
      expect(await adapter.validate("")).toBe(false);
      expect(await adapter.validate(" ")).toBe(false);
      expect(await adapter.validate("\n")).toBe(false);
    });

    it("should return true for valid input", async () => {
      expect(await adapter.validate("valid podcast content")).toBe(true);
      expect(await adapter.validate("line 1\nline 2")).toBe(true);
    });

    it("should handle validation errors gracefully", async () => {
      const input = {
        toString: () => {
          throw new Error("Invalid input");
        },
      };
      expect(await adapter.validate(input as any)).toBe(false);
    });
  });

  describe("process", () => {
    const validInput = "valid podcast content";
    const options: ProcessingOptions = {
      format: "podcast",
      quality: "draft",
      analyzeSentiment: true,
      extractEntities: true,
      includeTimestamps: true,
    };

    it("should process content with all analysis options", async () => {
      const result = await adapter.process(validInput, options);

      const expectedMetadata: ProcessingMetadata = {
        format: "podcast",
        platform: "default",
        processedAt: expect.any(String),
        title: expect.any(String),
        duration: expect.any(String),
        speakers: expect.any(Array),
        topics: expect.any(Array),
      };

      const expectedAnalysis: ProcessingAnalysis = {
        entities: {
          people: expect.any(Array),
          organizations: expect.any(Array),
          locations: expect.any(Array),
          events: expect.any(Array),
        },
        timeline: expect.any(Array),
        sentiment: {
          overall: expect.any(Number),
          segments: expect.any(Array),
        } as SentimentAnalysis,
      };

      expect(result).toEqual({
        id: expect.any(String),
        status: "completed" as ProcessingStatus,
        success: true,
        output: expect.any(String),
        metadata: expectedMetadata,
        analysis: expectedAnalysis,
      } as BaseProcessingResult);
    });

    it("should process content without analysis options", async () => {
      const basicOptions: ProcessingOptions = {
        format: "podcast",
        quality: "draft",
      };

      const result = await adapter.process(validInput, basicOptions);

      const expectedMetadata: ProcessingMetadata = {
        format: "podcast",
        platform: "default",
        processedAt: expect.any(String),
        title: expect.any(String),
        duration: expect.any(String),
        speakers: expect.any(Array),
        topics: expect.any(Array),
      };

      expect(result).toEqual({
        id: expect.any(String),
        status: "completed" as ProcessingStatus,
        success: true,
        output: expect.any(String),
        metadata: expectedMetadata,
      } as BaseProcessingResult);

      expect(result.analysis).toBeUndefined();
    });

    it("should handle processing errors", async () => {
      const result = await adapter.process("", options);

      const expectedMetadata: ProcessingMetadata = {
        format: "podcast",
        platform: "default",
        processedAt: expect.any(String),
      };

      expect(result).toEqual({
        id: expect.any(String),
        status: "failed" as ProcessingStatus,
        success: false,
        output: "",
        error: expect.any(String),
        metadata: expectedMetadata,
      } as BaseProcessingResult);
    });
  });

  describe("getStatus", () => {
    it("should return processing status", async () => {
      const result = await adapter.getStatus("test-id");

      const expectedMetadata: ProcessingMetadata = {
        format: "podcast",
        platform: "default",
        processedAt: expect.any(String),
      };

      expect(result).toEqual({
        id: "test-id",
        status: "completed" as ProcessingStatus,
        success: true,
        output: "",
        metadata: expectedMetadata,
      } as BaseProcessingResult);
    });
  });
});
