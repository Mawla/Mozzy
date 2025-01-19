import { PostProcessingAdapter } from "@/app/core/processing/adapters/post";
import {
  ProcessingOptions,
  ProcessingStatus,
  ProcessingResult,
} from "@/app/core/processing/types";

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

      expect(result).toEqual({
        id: expect.any(String),
        status: "completed" as ProcessingStatus,
        output: expect.any(String),
        metadata: {
          format: "post",
          platform: "default",
          processedAt: expect.any(String),
          title: expect.any(String),
          topics: expect.any(Array),
        },
        analysis: {
          entities: {
            people: expect.any(Array),
            organizations: expect.any(Array),
            locations: expect.any(Array),
            concepts: expect.any(Array),
          },
          sentiment: {
            overall: expect.any(Number),
            segments: expect.any(Array),
          },
        },
      });
    });

    it("should process content without analysis options", async () => {
      const basicOptions: ProcessingOptions = {
        format: "post",
        quality: "draft",
      };

      const result = await adapter.process(validInput, basicOptions);

      expect(result).toEqual({
        id: expect.any(String),
        status: "completed" as ProcessingStatus,
        output: expect.any(String),
        metadata: {
          format: "post",
          platform: "default",
          processedAt: expect.any(String),
          title: expect.any(String),
          topics: expect.any(Array),
        },
      });

      expect(result.analysis).toBeUndefined();
    });

    it("should handle processing errors", async () => {
      const result = await adapter.process("", options);

      expect(result).toEqual({
        id: expect.any(String),
        status: "failed" as ProcessingStatus,
        output: "",
        error: expect.any(String),
        metadata: {
          format: "post",
          platform: "default",
          processedAt: expect.any(String),
        },
      });
    });
  });

  describe("getStatus", () => {
    it("should return processing status", async () => {
      const result = await adapter.getStatus("test-id");

      expect(result).toEqual({
        id: "test-id",
        status: "completed" as ProcessingStatus,
        output: "",
        metadata: {
          format: "post",
          platform: "default",
          processedAt: expect.any(String),
        },
      });
    });
  });
});
