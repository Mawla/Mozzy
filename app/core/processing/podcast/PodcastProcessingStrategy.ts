import {
  ProcessingResult,
  TextChunk,
  ChunkResult,
  PodcastAnalysis,
  PodcastEntities,
  ContentMetadata,
  MetadataResponse,
} from "../types";
import {
  refinePodcastTranscript,
  generateSummary,
  generateTitle,
  suggestTags,
} from "@/app/actions/anthropicActions";
import { ProcessingLogger } from "../utils/logger";
import { ProcessingStrategy } from "../base/ProcessingStrategy";
import { ProcessingStep } from "../types";
import { ProcessingError } from "../errors/ProcessingError";

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
        id: "synthesis",
        name: "Result Synthesis",
        description: "Combining analysis and metadata",
        status: "pending",
        progress: 0,
        dependencies: ["analyze", "metadata"], // Depends on both analysis and metadata
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
          ProcessingLogger.log("info", `Refining chunk ${chunk.id}`, {
            length: chunk.text.length,
          });
          const refined = await refinePodcastTranscript(chunk.text);
          return { refinedText: refined };
        }
      );

      // Step 2: Generate analysis (parallel with metadata)
      const analysisPromise = this.executeStepWithDependencies(
        "analyze",
        async () => {
          const summary = await generateSummary(refinedText.refinedText);
          const title = await generateTitle(refinedText.refinedText);
          const analysis = {
            id: Date.now().toString(),
            title,
            summary,
            quickFacts: {
              duration: "0:00",
              participants: [],
              mainTopic: "",
              expertise: "",
            },
            keyPoints: [],
            themes: [],
          } as PodcastAnalysis;
          return { analysis };
        }
      );

      // Step 3: Generate metadata (parallel with analysis)
      const metadataPromise = this.executeStepWithDependencies(
        "metadata",
        async () => {
          const rawMetadata = (await suggestTags(
            refinedText.refinedText
          )) as ContentMetadata;
          const metadata = {
            duration: rawMetadata?.duration ?? "0:00",
            speakers: rawMetadata?.speakers ?? [],
            mainTopic: rawMetadata?.mainTopic ?? "Unknown",
            expertise: rawMetadata?.expertise ?? "General",
            keyPoints: [],
            themes: [],
          } as MetadataResponse;
          return { metadata };
        }
      );

      // Wait for both analysis and metadata
      const [analysisResult, metadataResult] = await Promise.all([
        analysisPromise,
        metadataPromise,
      ]);

      // Step 4: Synthesize results
      const result = await this.executeStepWithDependencies(
        "synthesis",
        async () => {
          const { analysis } = analysisResult;
          const { metadata } = metadataResult;

          // Update analysis with metadata
          analysis.quickFacts = {
            duration: metadata.duration,
            participants: metadata.speakers,
            mainTopic: metadata.mainTopic,
            expertise: metadata.expertise,
          };
          analysis.keyPoints = metadata.keyPoints ?? [];
          analysis.themes = metadata.themes ?? [];

          const entities: PodcastEntities = {
            people: metadata.speakers,
            organizations: [],
            locations: [],
            events: [],
          };

          return {
            id: chunk.id,
            refinedText: refinedText.refinedText,
            analysis,
            entities,
            timeline: [],
          };
        }
      );

      this.results.push(result);
      return result;
    } catch (error) {
      ProcessingLogger.log("error", `Failed to process chunk ${chunk.id}`, {
        error,
      });
      throw error;
    }
  }

  public validate(chunk: TextChunk): boolean {
    if (!chunk.text || typeof chunk.text !== "string") {
      return false;
    }
    if (chunk.text.length === 0) {
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
