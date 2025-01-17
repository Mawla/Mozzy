import {
  ProcessingResult,
  TextChunk,
  ChunkResult,
  PodcastAnalysis,
  PodcastEntities,
  ContentMetadata,
  MetadataResponse,
} from "../types";

import { logger } from "@/lib/logger";
import { ProcessingStrategy } from "../base/ProcessingStrategy";
import { ProcessingStep } from "../types";
import { ProcessingError } from "../errors/ProcessingError";
import { podcastService } from "@/app/services/podcastService";

interface StepResult {
  refinedText?: string;
  analysis?: PodcastAnalysis;
  metadata?: MetadataResponse;
}

export class PodcastProcessingStrategy extends ProcessingStrategy<
  TextChunk,
  ChunkResult
> {
  private results: ChunkResult[] = [];
  private stepResults: Map<string, StepResult> = new Map();

  protected defineSteps(): ProcessingStep[] {
    return [
      {
        id: "refine",
        name: "Transcript Refinement",
        description: "Cleaning and formatting the transcript text",
        status: "pending",
        progress: 0,
        dependencies: [], // No dependencies
      },
      {
        id: "analyze",
        name: "Content Analysis",
        description: "Generating summary and extracting key information",
        status: "pending",
        progress: 0,
        dependencies: ["refine"], // Depends on refined text
      },
      {
        id: "metadata",
        name: "Metadata Generation",
        description: "Creating tags and content metadata",
        status: "pending",
        progress: 0,
        dependencies: ["refine"], // Depends on refined text
      },
      {
        id: "events",
        name: "Event Detection",
        description: "Detecting and organizing timeline events",
        status: "pending",
        progress: 0,
        dependencies: ["refine", "analyze"], // Depends on refined text and analysis
      },
      {
        id: "synthesis",
        name: "Result Synthesis",
        description: "Combining analysis, metadata, and events",
        status: "pending",
        progress: 0,
        dependencies: ["analyze", "metadata", "events"], // Depends on all previous steps
      },
    ];
  }

  private async executeStepWithDependencies(
    stepId: string,
    executor: () => Promise<any>
  ): Promise<any> {
    const step = this.state.steps.find((s) => s.id === stepId);
    if (!step)
      throw new ProcessingError("Unknown step", "UNKNOWN_STEP", stepId);

    // Check dependencies
    const dependencies = step.dependencies || [];
    for (const depId of dependencies) {
      const depStep = this.state.steps.find((s) => s.id === depId);
      if (!depStep || depStep.status !== "completed") {
        throw new ProcessingError(
          `Dependency ${depId} not met for step ${stepId}`,
          "DEPENDENCY_ERROR",
          stepId
        );
      }
    }

    try {
      step.status = "processing";
      const result = await executor();
      step.status = "completed";
      step.progress = 100;
      this.stepResults.set(stepId, result);
      return result;
    } catch (error) {
      step.status = "failed";
      step.error = error as Error;
      throw error;
    } finally {
      this.updateOverallProgress();
    }
  }

  public async process(chunk: TextChunk): Promise<ChunkResult> {
    try {
      this.stepResults.clear();

      // Step 1: Refine the text
      const refinedText = await this.executeStepWithDependencies(
        "refine",
        async () => {
          const refined = await podcastService.refineText(chunk.text);
          return { refinedText: refined };
        }
      );

      // Step 2: Generate analysis
      const analysisPromise = this.executeStepWithDependencies(
        "analyze",
        async () => {
          const analysis = await podcastService.analyze(
            refinedText.refinedText
          );
          return { analysis };
        }
      );

      // Step 3: Generate metadata
      const metadataPromise = this.executeStepWithDependencies(
        "metadata",
        async () => {
          const entities = await podcastService.extractEntities(
            refinedText.refinedText
          );

          const metadata: MetadataResponse = {
            duration: "0:00",
            speakers: entities.people.map((p) => p.name),
            mainTopic: "Unknown",
            expertise: "General",
            keyPoints: [],
            themes: [],
          };

          return { metadata, entities };
        }
      );

      // Step 4: Detect events
      const eventsPromise = this.executeStepWithDependencies(
        "events",
        async () => {
          const timeline = await podcastService.detectEvents(
            refinedText.refinedText
          );
          return { timeline };
        }
      );

      // Wait for all parallel steps
      const [analysisResult, metadataResult, eventsResult] = await Promise.all([
        analysisPromise,
        metadataPromise,
        eventsPromise,
      ]);

      // Step 5: Synthesize results
      const result = await this.executeStepWithDependencies(
        "synthesis",
        async () => {
          const { analysis } = analysisResult;
          const { metadata, entities } = metadataResult;
          const { timeline } = eventsResult;

          // Update analysis with metadata
          analysis.quickFacts = {
            duration: metadata.duration,
            participants: metadata.speakers,
            mainTopic: metadata.mainTopic,
            expertise: metadata.expertise,
          };
          analysis.keyPoints = metadata.keyPoints ?? [];
          analysis.themes = metadata.themes ?? [];

          return {
            id: chunk.id,
            refinedText: refinedText.refinedText,
            analysis,
            entities,
            timeline: timeline.events,
          };
        }
      );

      this.results.push(result);
      return result;
    } catch (error) {
      logger.error(
        "Failed to process chunk",
        error instanceof Error ? error : new Error(String(error)),
        {
          chunkId: chunk.id,
        }
      );
      throw error;
    }
  }

  public validate(chunk: TextChunk): boolean {
    if (!chunk || typeof chunk !== "object") {
      logger.error("Invalid chunk: not an object", undefined, { chunk });
      return false;
    }

    if (typeof chunk.text !== "string" || chunk.text.length === 0) {
      logger.error("Invalid chunk: invalid text", undefined, {
        textType: typeof chunk.text,
        textLength: chunk.text?.length,
      });
      return false;
    }

    if (
      typeof chunk.id !== "number" ||
      !Number.isInteger(chunk.id) ||
      chunk.id < 0
    ) {
      logger.error("Invalid chunk: invalid id", undefined, {
        idType: typeof chunk.id,
        id: chunk.id,
      });
      return false;
    }

    return true;
  }

  public clearResults(): void {
    this.results = [];
    this.stepResults.clear();
    this.state.steps.forEach((step) => {
      step.status = "pending";
      step.progress = 0;
    });
    this.state.overallProgress = 0;
    this.state.status = "idle";
  }

  public getStepResult(stepId: string): StepResult | undefined {
    return this.stepResults.get(stepId);
  }

  public async combine(results: ChunkResult[]): Promise<ChunkResult> {
    if (results.length === 0) {
      throw new ProcessingError("No results to combine", "NO_RESULTS_ERROR");
    }

    if (results.length === 1) {
      return results[0];
    }

    // Combine all refined texts
    const refinedText = results.map((r) => r.refinedText).join(" ");

    // Combine analyses
    const combinedAnalysis: PodcastAnalysis = {
      id: Date.now().toString(),
      title: results[0].analysis.title,
      summary: results.map((r) => r.analysis.summary).join("\n"),
      quickFacts: results[0].analysis.quickFacts,
      keyPoints: results.flatMap((r) => r.analysis.keyPoints),
      themes: Array.from(new Set(results.flatMap((r) => r.analysis.themes))),
    };

    // Combine entities
    const combinedEntities: PodcastEntities = {
      people: Array.from(new Set(results.flatMap((r) => r.entities.people))),
      organizations: Array.from(
        new Set(results.flatMap((r) => r.entities.organizations))
      ),
      locations: Array.from(
        new Set(results.flatMap((r) => r.entities.locations))
      ),
      events: Array.from(new Set(results.flatMap((r) => r.entities.events))),
    };

    return {
      id: -1,
      refinedText,
      analysis: combinedAnalysis,
      entities: combinedEntities,
      timeline: results.flatMap((r) => r.timeline),
    };
  }
}
