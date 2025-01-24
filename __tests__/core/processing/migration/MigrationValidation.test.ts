import { ProcessingService } from "@/app/core/processing/service/ProcessingService";
import { PodcastProcessingAdapter } from "@/app/core/processing/adapters/podcast";
import { PostProcessingAdapter } from "@/app/core/processing/adapters/post";
import type {
  ProcessingStatus,
  ProcessingResult,
  ProcessingAnalysis,
  TimelineEvent,
  ProcessingOptions,
} from "@/app/types/processing/base";
import { PodcastProcessor } from "@/app/core/processing/podcast/PodcastProcessor";

describe("Migration Validation", () => {
  let service: ProcessingService;
  let podcastAdapter: PodcastProcessingAdapter;
  let postAdapter: PostProcessingAdapter;
  let podcastProcessor: PodcastProcessor;

  // Sample legacy data
  const legacyPodcastData = {
    transcript: `
      [00:00:00] Speaker 1: Welcome to our podcast
      [00:00:05] Speaker 2: Today we'll discuss AI and machine learning
      [00:00:10] Speaker 1: Let's start with the basics
    `,
    metadata: {
      title: "AI Basics",
      duration: "00:30:00",
      speakers: ["John", "Jane"],
      topics: ["AI", "Machine Learning"],
    },
  };

  const legacyPostData = {
    content: `
      # Understanding AI

      Artificial Intelligence is transforming how we work and live.
      Let's explore the key concepts and applications.

      ## Key Points
      1. Machine Learning
      2. Neural Networks
      3. Deep Learning
    `,
    metadata: {
      title: "Understanding AI",
      author: "John Doe",
      topics: ["AI", "Technology"],
    },
  };

  beforeEach(() => {
    service = new ProcessingService();
    podcastProcessor = new PodcastProcessor();
    podcastAdapter = new PodcastProcessingAdapter();
    postAdapter = new PostProcessingAdapter();

    service.registerAdapter("podcast", podcastAdapter);
    service.registerAdapter("post", postAdapter);
  });

  describe("Legacy Data Processing", () => {
    it("should process legacy podcast data correctly", async () => {
      const options: ProcessingOptions = {
        format: "podcast",
        quality: "final",
        analyzeSentiment: true,
        extractEntities: true,
        includeTimestamps: true,
      };

      const result = await service.process(
        "podcast",
        legacyPodcastData.transcript,
        options
      );

      // Verify core functionality
      expect(result.status).toBe("completed" as ProcessingStatus);
      expect(result.output).toBeTruthy();

      // Verify metadata migration
      expect(result.metadata.title).toBe(legacyPodcastData.metadata.title);
      expect(result.metadata.duration).toBe(
        legacyPodcastData.metadata.duration
      );
      expect(result.metadata.speakers).toEqual(
        expect.arrayContaining(legacyPodcastData.metadata.speakers)
      );
      expect(result.metadata.topics).toEqual(
        expect.arrayContaining(legacyPodcastData.metadata.topics)
      );

      // Verify analysis features
      expect(result.analysis?.entities).toBeDefined();
      expect(result.analysis?.sentiment).toBeDefined();
      expect(result.analysis?.timeline).toBeDefined();
    });

    it("should process legacy post data correctly", async () => {
      const options: ProcessingOptions = {
        format: "post",
        quality: "final",
        analyzeSentiment: true,
        extractEntities: true,
      };

      const result = await service.process(
        "post",
        legacyPostData.content,
        options
      );

      // Verify core functionality
      expect(result.status).toBe("completed" as ProcessingStatus);
      expect(result.output).toBeTruthy();

      // Verify metadata migration
      expect(result.metadata.title).toBe(legacyPostData.metadata.title);
      expect(result.metadata.topics).toEqual(
        expect.arrayContaining(legacyPostData.metadata.topics)
      );

      // Verify analysis features
      expect(result.analysis?.entities).toBeDefined();
      expect(result.analysis?.sentiment).toBeDefined();
      expect(result.analysis?.timeline).toBeUndefined(); // Posts don't have timeline
    });
  });

  describe("Format Compatibility", () => {
    it("should maintain podcast-specific features", async () => {
      const result = await service.process(
        "podcast",
        legacyPodcastData.transcript,
        {
          format: "podcast",
          quality: "final",
          includeTimestamps: true,
        }
      );

      // Verify podcast-specific features
      expect(result.metadata.speakers).toBeDefined();
      expect(result.metadata.duration).toBeDefined();
      expect(result.analysis?.timeline).toBeDefined();
    });

    it("should maintain post-specific features", async () => {
      const result = await service.process("post", legacyPostData.content, {
        format: "post",
        quality: "final",
      });

      // Verify post-specific features
      expect(result.metadata.title).toBeDefined();
      expect(result.metadata.topics).toBeDefined();
      expect(result.analysis?.timeline).toBeUndefined();
    });
  });

  describe("Error Handling Migration", () => {
    it("should handle legacy podcast errors consistently", async () => {
      const invalidPodcast = {
        transcript: "",
        metadata: {},
      };

      const result = await service.process(
        "podcast",
        invalidPodcast.transcript,
        {
          format: "podcast",
          quality: "final",
        }
      );

      expect(result.status).toBe("failed" as ProcessingStatus);
      expect(result.error).toBeDefined();
    });

    it("should handle legacy post errors consistently", async () => {
      const invalidPost = {
        content: "",
        metadata: {},
      };

      const result = await service.process("post", invalidPost.content, {
        format: "post",
        quality: "final",
      });

      expect(result.status).toBe("failed" as ProcessingStatus);
      expect(result.error).toBeDefined();
    });
  });

  describe("Performance Migration", () => {
    it("should maintain performance with legacy podcast data", async () => {
      const startTime = Date.now();

      await service.process("podcast", legacyPodcastData.transcript, {
        format: "podcast",
        quality: "final",
        analyzeSentiment: true,
        extractEntities: true,
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // 5s timeout
    });

    it("should maintain performance with legacy post data", async () => {
      const startTime = Date.now();

      await service.process("post", legacyPostData.content, {
        format: "post",
        quality: "final",
        analyzeSentiment: true,
        extractEntities: true,
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // 5s timeout
    });
  });
});
