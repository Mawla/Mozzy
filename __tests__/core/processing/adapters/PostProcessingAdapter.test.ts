import { PostProcessingAdapter } from "@/app/core/processing/adapters/post";
import type {
  ProcessingOptions,
  ProcessingResult,
  ProcessingStatus,
  ProcessingFormat,
  BaseProcessingResult,
  ProcessingMetadata,
  ProcessingAnalysis,
  SentimentAnalysis,
} from "@/app/types/processing";
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  ConceptEntity,
} from "@/app/types/entities/podcast";

describe("PostProcessingAdapter", () => {
  let adapter: PostProcessingAdapter;

  beforeEach(() => {
    adapter = new PostProcessingAdapter();
  });

  describe("validate", () => {
    it("should return false for empty input", async () => {
      expect(await adapter.validate("")).toBe(false);
      expect(await adapter.validate(" ")).toBe(false);
      expect(await adapter.validate("\n")).toBe(false);
    });

    it("should return true for valid input", async () => {
      expect(await adapter.validate("valid post content")).toBe(true);
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
    const validInput = "valid post content";
    const options: ProcessingOptions = {
      format: "post",
      quality: "draft",
      analyzeSentiment: true,
      extractEntities: true,
    };

    it("should process content with all analysis options", async () => {
      const result = await adapter.process(validInput, options);

      const expectedMetadata: ProcessingMetadata = {
        format: "post",
        platform: "default",
        processedAt: expect.any(String),
        title: expect.any(String),
        topics: expect.any(Array),
      };

      const expectedAnalysis: ProcessingAnalysis = {
        entities: {
          people: expect.any(Array),
          organizations: expect.any(Array),
          locations: expect.any(Array),
          events: expect.any(Array),
        },
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
        format: "post",
        quality: "draft",
      };

      const result = await adapter.process(validInput, basicOptions);

      const expectedMetadata: ProcessingMetadata = {
        format: "post",
        platform: "default",
        processedAt: expect.any(String),
        title: expect.any(String),
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
        format: "post",
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
        format: "post",
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

// Create mock result
const createMockResult = (overrides = {}): ProcessingResult => ({
  id: "test-id",
  status: "completed" as ProcessingStatus,
  success: true,
  output: "test output",
  metadata: {
    format: "post" as ProcessingFormat,
    platform: "test",
    processedAt: new Date().toISOString(),
  },
  format: "post" as ProcessingFormat,
  analysis: {
    title: "Test",
    summary: "Test summary",
  },
  entities: {
    people: [],
    organizations: [],
    locations: [],
    events: [],
  },
  timeline: [],
  ...overrides,
});
