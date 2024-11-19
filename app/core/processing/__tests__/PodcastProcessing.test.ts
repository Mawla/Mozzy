import { PodcastProcessingStrategy } from "../podcast/PodcastProcessingStrategy";
import { ProcessingPipeline } from "../base/ProcessingPipeline";
import { TextChunkingStrategy } from "../strategies/TextChunkingStrategy";
import { ProcessingError } from "../errors/ProcessingError";
import { TextChunk, ChunkResult } from "../types";

// Mock the anthropic actions only
jest.mock("@/app/actions/anthropicActions");

describe("Podcast Processing Pipeline", () => {
  let pipeline: ProcessingPipeline<string, TextChunk, ChunkResult>;
  let chunkingStrategy: TextChunkingStrategy;
  let processingStrategy: PodcastProcessingStrategy;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    chunkingStrategy = new TextChunkingStrategy();
    processingStrategy = new PodcastProcessingStrategy();
    pipeline = new ProcessingPipeline(chunkingStrategy, processingStrategy);
  });

  it("should process a simple podcast transcript", async () => {
    const input = "This is a test podcast transcript.";
    const result = await pipeline.process(input);

    expect(result).toBeDefined();
    expect(result.refinedText).toBeDefined();
    expect(result.analysis).toBeDefined();
    expect(result.entities).toBeDefined();
  });

  it("should handle empty input", async () => {
    const input = "";
    await expect(pipeline.process(input)).rejects.toThrow(ProcessingError);
  });

  it("should process multiple chunks correctly", async () => {
    const input = `
      First chunk of the podcast.
      Second chunk of the podcast.
      Third chunk of the podcast.
    `;

    const result = await pipeline.process(input);

    expect(result).toBeDefined();
    expect(result.id).toBe(-1); // Combined result ID
    expect(pipeline.getChunks().length).toBeGreaterThan(1);
    expect(result.entities.people).toContain("Speaker 1");
  });

  it("should maintain step dependencies", async () => {
    const input = "Test podcast content";
    await pipeline.process(input);

    const state = processingStrategy.getState();
    const refineStep = state.steps.find((s) => s.id === "refine");
    const analyzeStep = state.steps.find((s) => s.id === "analyze");
    const metadataStep = state.steps.find((s) => s.id === "metadata");
    const synthesisStep = state.steps.find((s) => s.id === "synthesis");

    expect(refineStep?.status).toBe("completed");
    expect(analyzeStep?.status).toBe("completed");
    expect(metadataStep?.status).toBe("completed");
    expect(synthesisStep?.status).toBe("completed");
  });

  it("should handle processing errors gracefully", async () => {
    // Mock a failure in refinePodcastTranscript
    const mockError = new Error("Processing failed");
    jest.spyOn(processingStrategy, "process").mockRejectedValueOnce(mockError);

    const input = "Test podcast content";
    await expect(pipeline.process(input)).rejects.toThrow(ProcessingError);

    const state = processingStrategy.getState();
    expect(state.status).toBe("failed");
  });

  it("should combine results correctly", async () => {
    const input = `
      First chunk with Speaker 1.
      Second chunk with Speaker 2.
      Third chunk with Speaker 1 again.
    `;

    const result = await pipeline.process(input);

    // Check combined results
    expect(result.refinedText).toContain("First chunk");
    expect(result.refinedText).toContain("Second chunk");
    expect(result.refinedText).toContain("Third chunk");
    expect(result.entities.people).toContain("Speaker 1");
    expect(result.analysis.themes).toHaveLength(1);
  });

  it("should track progress correctly", async () => {
    const input = "Test podcast content";
    await pipeline.process(input);

    const state = processingStrategy.getState();
    expect(state.overallProgress).toBe(100);
    expect(state.steps.every((step) => step.progress === 100)).toBe(true);
  });

  it("should validate chunks before processing", async () => {
    // Create an invalid chunk
    jest.spyOn(chunkingStrategy, "validate").mockReturnValueOnce(false);

    const input = "Test podcast content";
    await expect(pipeline.process(input)).rejects.toThrow(
      "Invalid chunks generated"
    );
  });

  it("should process chunks in parallel within batch size", async () => {
    const input = `
      Chunk 1 content.
      Chunk 2 content.
      Chunk 3 content.
      Chunk 4 content.
    `;

    const processSpy = jest.spyOn(processingStrategy, "process");
    await pipeline.process(input);

    // Check that process was called for each chunk
    expect(processSpy).toHaveBeenCalled();
    expect(pipeline.getResults().length).toBeGreaterThan(0);
  });
});
