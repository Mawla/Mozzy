import { ProcessingService } from "@/app/core/processing/service/ProcessingService";
import { PodcastProcessingAdapter } from "@/app/core/processing/adapters/podcast";
import { PostProcessingAdapter } from "@/app/core/processing/adapters/post";
import { PodcastProcessor } from "@/app/core/processing/podcast/PodcastProcessor";
import type {
  ProcessingStatus,
  ProcessingResult,
  ProcessingAnalysis,
  TimelineEvent,
  ProcessingOptions,
  BaseProcessingResult,
  ProcessingFormat,
} from "@/app/types/processing/base";
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  ValidatedBaseEntity,
} from "@/app/types/entities/base";

describe("ProcessingService", () => {
  let service: ProcessingService;
  let podcastAdapter: PodcastProcessingAdapter;
  let postAdapter: PostProcessingAdapter;
  let podcastProcessor: PodcastProcessor;

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
    podcastProcessor = new PodcastProcessor();
    podcastAdapter = new PodcastProcessingAdapter(podcastProcessor);
    postAdapter = new PostProcessingAdapter();

    service.registerAdapter("podcast" as ProcessingFormat, podcastAdapter);
    service.registerAdapter("post" as ProcessingFormat, postAdapter);
  });

  describe("Core Processing", () => {
    it("should process content identically regardless of format", async () => {
      const options: ProcessingOptions = {
        format: "podcast",
        quality: "draft",
        analyzeSentiment: true,
        extractEntities: true,
      };

      // Process as podcast
      const podcastResult = await service.process("podcast", sampleText, {
        ...options,
        format: "podcast",
      });

      // Process as post
      const postResult = await service.process("post", sampleText, {
        ...options,
        format: "post",
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

      expect(result.status).toBe("completed");
      expect(result.output).toBeTruthy();
    });

    it("should extract entities consistently", async () => {
      const result = await service.process("post", sampleText, {
        format: "post",
        quality: "draft",
        extractEntities: true,
      });

      const entities = result.analysis?.entities;
      expect(
        entities?.people.some((p: PersonEntity) => p.name === "John Doe")
      ).toBe(true);
      expect(
        entities?.people.some((p: PersonEntity) => p.name === "Jane Smith")
      ).toBe(true);
      expect(
        entities?.organizations.some(
          (o: OrganizationEntity) => o.name === "Acme Corp"
        )
      ).toBe(true);
      expect(
        entities?.locations.some((l: LocationEntity) => l.name === "New York")
      ).toBe(true);
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

      expect(podcastResult.timeline).toBeDefined();
      expect(postResult.timeline).toBeUndefined();
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
      const options: ProcessingOptions = {
        format: "podcast",
        quality: "draft",
      };

      await expect(
        service.process("podcast", emptyInput, {
          ...options,
          format: "podcast",
        })
      ).rejects.toThrow("Invalid input");

      await expect(
        service.process("post", emptyInput, {
          ...options,
          format: "post",
        })
      ).rejects.toThrow("Invalid input");
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

      expect(result.status).toBe("failed");
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
        results.every((r: BaseProcessingResult) => r.status === "completed")
      ).toBe(true);
    });
  });

  describe("Validation", () => {
    it("should validate input consistently across formats", async () => {
      const isValidPodcast = await podcastAdapter.validate(sampleText);
      const isValidPost = await postAdapter.validate(sampleText);

      expect(isValidPodcast).toBe(isValidPost);
    });

    it("should reject malformed content", async () => {
      const malformedContent = "   ";

      const isValidPodcast = await podcastAdapter.validate(malformedContent);
      const isValidPost = await postAdapter.validate(malformedContent);

      expect(isValidPodcast).toBe(false);
      expect(isValidPost).toBe(false);
    });
  });
});
