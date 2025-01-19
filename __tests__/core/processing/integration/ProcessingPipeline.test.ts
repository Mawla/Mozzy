import { ProcessingService } from "@/app/core/processing/service/ProcessingService";
import { PodcastProcessingAdapter } from "@/app/core/processing/adapters/podcast";
import { PostProcessingAdapter } from "@/app/core/processing/adapters/post";
import {
  ProcessingResult,
  ProcessingStatus,
} from "@/app/core/processing/types";

describe("Processing Pipeline", () => {
  let service: ProcessingService;
  let podcastAdapter: PodcastProcessingAdapter;
  let postAdapter: PostProcessingAdapter;

  const sampleText = `
    This is a sample text that could be either a podcast transcript
    or a blog post. The core processing should handle both the same way.
    
    It contains multiple paragraphs and potential entities like:
    - People: John Doe, Jane Smith
    - Organizations: Acme Corp, TechCo
    - Locations: New York, London
  `;

  beforeEach(() => {
    service = new ProcessingService();
    podcastAdapter = new PodcastProcessingAdapter();
    postAdapter = new PostProcessingAdapter();

    service.registerAdapter("podcast", podcastAdapter);
    service.registerAdapter("post", postAdapter);
  });

  describe("Core Processing", () => {
    it("should process content identically regardless of format", async () => {
      // Process as podcast
      const podcastResult = await service.process("podcast", sampleText, {
        format: "podcast",
        quality: "draft",
        analyzeSentiment: true,
        extractEntities: true,
      });

      // Process as post
      const postResult = await service.process("post", sampleText, {
        format: "post",
        quality: "draft",
        analyzeSentiment: true,
        extractEntities: true,
      });

      // Core processing results should be identical
      expect(podcastResult.output).toBe(postResult.output);
      expect(podcastResult.analysis?.entities).toEqual(
        postResult.analysis?.entities
      );
      expect(podcastResult.analysis?.sentiment).toEqual(
        postResult.analysis?.sentiment
      );

      // Only metadata format should differ
      expect(podcastResult.metadata.format).toBe("podcast");
      expect(postResult.metadata.format).toBe("post");
    });

    it("should handle large content in chunks", async () => {
      const largeContent = Array(10).fill(sampleText).join("\n\n");

      const result = await service.process("post", largeContent, {
        format: "post",
        quality: "draft",
        analyzeSentiment: true,
        extractEntities: true,
      });

      expect(result.status).toBe("completed" as ProcessingStatus);
      expect(result.output).toBeTruthy();
      expect(result.error).toBeUndefined();
    });

    it("should extract entities consistently", async () => {
      const result = await service.process("post", sampleText, {
        format: "post",
        quality: "draft",
        extractEntities: true,
      });

      expect(result.analysis?.entities?.people).toContain("John Doe");
      expect(result.analysis?.entities?.people).toContain("Jane Smith");
      expect(result.analysis?.entities?.organizations).toContain("Acme Corp");
      expect(result.analysis?.entities?.locations).toContain("New York");
    });
  });

  describe("Format-Specific Features", () => {
    it("should include timeline for podcasts only", async () => {
      const podcastResult = await service.process("podcast", sampleText, {
        format: "podcast",
        quality: "draft",
        includeTimestamps: true,
      });
      const postResult = await service.process("post", sampleText, {
        format: "post",
        quality: "draft",
      });

      expect(podcastResult.analysis?.timeline).toBeDefined();
      expect(postResult.analysis?.timeline).toBeUndefined();
    });

    it("should handle speaker detection for podcasts", async () => {
      const podcastResult = await service.process("podcast", sampleText, {
        format: "podcast",
        quality: "draft",
      });
      const postResult = await service.process("post", sampleText, {
        format: "post",
        quality: "draft",
      });

      expect(podcastResult.metadata.speakers).toBeDefined();
      expect(postResult.metadata.speakers).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid input consistently", async () => {
      const emptyInput = "";

      const podcastResult = await service.process("podcast", emptyInput, {
        format: "podcast",
        quality: "draft",
      });
      const postResult = await service.process("post", emptyInput, {
        format: "post",
        quality: "draft",
      });

      expect(podcastResult.status).toBe("failed" as ProcessingStatus);
      expect(postResult.status).toBe("failed" as ProcessingStatus);
      expect(podcastResult.error).toBeDefined();
      expect(postResult.error).toBeDefined();
    });

    it("should handle processing failures gracefully", async () => {
      // Mock a processing failure
      jest
        .spyOn(podcastAdapter, "process")
        .mockRejectedValueOnce(new Error("Processing failed"));

      const result = await service.process("podcast", sampleText, {
        format: "podcast",
        quality: "draft",
      });

      expect(result.status).toBe("failed" as ProcessingStatus);
      expect(result.error).toBeDefined();
    });
  });

  describe("Performance", () => {
    it("should process content within timeout", async () => {
      const startTime = Date.now();

      await service.process("post", sampleText, {
        format: "post",
        quality: "draft",
        analyzeSentiment: true,
        extractEntities: true,
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // 5s timeout
    });

    it("should handle concurrent processing", async () => {
      const tasks = Array(5)
        .fill(null)
        .map(() =>
          service.process("post", sampleText, {
            format: "post",
            quality: "draft",
          })
        );

      const results = await Promise.all(tasks);
      expect(results).toHaveLength(5);
      expect(
        results.every((r: ProcessingResult) => r.status === "completed")
      ).toBe(true);
    });
  });
});
