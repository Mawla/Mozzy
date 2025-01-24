import { ProcessingService } from "@/app/core/processing/service/ProcessingService";
import { PodcastProcessingAdapter } from "@/app/core/processing/adapters/podcast";
import { PostProcessingAdapter } from "@/app/core/processing/adapters/post";
import { PodcastProcessor } from "@/app/core/processing/podcast/PodcastProcessor";
import { ProcessingPipeline } from "@/app/core/processing/base/ProcessingPipeline";
import { ProcessingStrategy } from "@/app/core/processing/base/ProcessingStrategy";
import { TextChunkingStrategy } from "@/app/core/processing/strategies/TextChunkingStrategy";
import type {
  ProcessingResult,
  ProcessingOptions,
  ProcessingMetadata,
  ProcessingAnalysis,
  ProcessingState,
  ProcessingStep,
  BaseTextChunk,
} from "@/app/types/processing/types";
import {
  ProcessingStatus,
  ProcessingFormat,
} from "@/app/types/processing/base";
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
} from "@/app/types/entities/base";

// Test strategy implementation
class TestProcessingStrategy
  implements ProcessingStrategy<BaseTextChunk, ProcessingResult>
{
  private state: ProcessingState = {
    status: "idle",
    overallProgress: 0,
    steps: [],
    chunks: [],
    networkLogs: [],
    currentTranscript: "",
    error: undefined,
  };

  getState(): ProcessingState {
    return this.state;
  }

  async processStep(stepId: string): Promise<void> {
    const step = this.getStepById(stepId);
    if (step) {
      step.status = "completed";
      step.progress = 100;
    }
  }

  getStepById(stepId: string): ProcessingStep | undefined {
    return this.state.steps.find((step) => step.id === stepId);
  }

  updateStepStatus(
    stepId: string,
    status: ProcessingStatus,
    data?: unknown
  ): void {
    const step = this.getStepById(stepId);
    if (step) {
      step.status = status;
      if (data !== undefined) {
        step.result = data;
      }
    }
  }

  async process(chunk: BaseTextChunk): Promise<ProcessingResult> {
    return {
      id: "test-id",
      format: "podcast" as ProcessingFormat,
      status: "completed",
      success: true,
      output: chunk.text,
      metadata: {
        format: "podcast",
        platform: "test",
        processedAt: new Date().toISOString(),
      },
      analysis: {
        id: "test-analysis",
        title: "Test Analysis",
        summary: "Test summary",
        entities: {
          people: [],
          organizations: [],
          locations: [],
          events: [],
        },
        timeline: [],
      },
      entities: {
        people: [],
        organizations: [],
        locations: [],
        events: [],
      },
      timeline: [],
      transcript: chunk.text,
      chunks: [{ id: chunk.id, text: chunk.text }],
    };
  }

  async combine(results: ProcessingResult[]): Promise<ProcessingResult> {
    return {
      ...results[0],
      output: results.map((r) => r.output).join("\n"),
      transcript: results.map((r) => r.transcript).join("\n"),
      chunks: results.flatMap((r) => r.chunks || []),
    };
  }
}

describe("Processing Pipeline", () => {
  let service: ProcessingService;
  let podcastAdapter: PodcastProcessingAdapter;
  let postAdapter: PostProcessingAdapter;
  let podcastProcessor: PodcastProcessor;
  let pipeline: ProcessingPipeline<string, BaseTextChunk, ProcessingResult>;
  let strategy: TestProcessingStrategy;

  const sampleText = `
    This is a sample text that could be either a podcast transcript
    or a blog post. The core processing should handle both the same way.
    
    It contains multiple paragraphs and potential entities like:
    - People: John Doe, Jane Smith
    - Organizations: Acme Corp, TechCo
    - Locations: New York, London
  `;

  const defaultOptions: ProcessingOptions = {
    format: "podcast",
    quality: "draft",
    analyzeSentiment: true,
    extractEntities: true,
  };

  beforeEach(() => {
    service = new ProcessingService();
    podcastProcessor = new PodcastProcessor();
    podcastAdapter = new PodcastProcessingAdapter();
    postAdapter = new PostProcessingAdapter();
    strategy = new TestProcessingStrategy();
    const chunkingStrategy = new TextChunkingStrategy();
    pipeline = new ProcessingPipeline<string, BaseTextChunk, ProcessingResult>(
      strategy,
      chunkingStrategy
    );

    service.registerAdapter("podcast" as ProcessingFormat, podcastAdapter);
    service.registerAdapter("post" as ProcessingFormat, postAdapter);
  });

  describe("Core Processing", () => {
    it("should process content identically regardless of format", async () => {
      // Process as podcast
      const podcastResult = await service.process("podcast", sampleText, {
        ...defaultOptions,
        format: "podcast",
      });

      // Process as post
      const postResult = await service.process("post", sampleText, {
        ...defaultOptions,
        format: "post",
      });

      // Core processing results should be identical
      expect(podcastResult.success).toBe(true);
      expect(postResult.success).toBe(true);
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

      const result = await service.process(
        "post",
        largeContent,
        defaultOptions
      );

      expect(result.success).toBe(true);
      expect(result.status).toBe("completed" as ProcessingStatus);
      expect(result.output).toBeTruthy();
      expect(result.error).toBeUndefined();
    });

    it("should extract entities consistently", async () => {
      const result = await service.process("post", sampleText, {
        ...defaultOptions,
        format: "post",
      });

      expect(result.success).toBe(true);
      expect(result.analysis?.entities).toBeDefined();

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
        ...defaultOptions,
        includeTimestamps: true,
      });
      const postResult = await service.process("post", sampleText, {
        ...defaultOptions,
        format: "post",
      });

      expect(podcastResult.success).toBe(true);
      expect(postResult.success).toBe(true);
      expect(podcastResult.analysis?.timeline).toBeDefined();
      expect(postResult.analysis?.timeline).toBeUndefined();
    });

    it("should handle speaker detection for podcasts", async () => {
      const podcastResult = await service.process(
        "podcast",
        sampleText,
        defaultOptions
      );
      const postResult = await service.process("post", sampleText, {
        ...defaultOptions,
        format: "post",
      });

      expect(podcastResult.success).toBe(true);
      expect(postResult.success).toBe(true);
      expect(podcastResult.metadata.speakers).toBeDefined();
      expect(postResult.metadata.speakers).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid input consistently", async () => {
      const emptyInput = "";

      const podcastResult = await service.process(
        "podcast",
        emptyInput,
        defaultOptions
      );
      const postResult = await service.process("post", emptyInput, {
        ...defaultOptions,
        format: "post",
      });

      expect(podcastResult.success).toBe(false);
      expect(postResult.success).toBe(false);
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

      const result = await service.process(
        "podcast",
        sampleText,
        defaultOptions
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe("failed" as ProcessingStatus);
      expect(result.error).toBeDefined();
    });
  });

  describe("Performance", () => {
    it("should process content within timeout", async () => {
      const startTime = Date.now();

      const result = await service.process("post", sampleText, {
        ...defaultOptions,
        format: "post",
      });

      expect(result.success).toBe(true);
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // 5s timeout
    });

    it("should handle concurrent processing", async () => {
      const tasks = Array(5)
        .fill(null)
        .map(() =>
          service.process("post", sampleText, {
            ...defaultOptions,
            format: "post",
          })
        );

      const results = await Promise.all(tasks);
      expect(results).toHaveLength(5);
      expect(
        results.every(
          (r: ProcessingResult) => r.status === "completed" && r.success
        )
      ).toBe(true);
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
