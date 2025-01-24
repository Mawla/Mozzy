import type {
  ProcessingChunk,
  ProcessingState,
  ProcessingStep,
  ProcessingResult,
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingAnalysis,
  ProcessingMetadata,
  TimelineEvent,
} from "@/app/types/processing/base";
import { ProcessingStatus } from "@/app/types/processing/constants";
import { logger } from "@/lib/logger";

import {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
} from "@/app/types/entities/base";

import { BaseProcessingStrategy } from "../base/ProcessingStrategy";
import { ProcessingError } from "../errors/ProcessingError";
import { podcastService } from "@/app/services/podcastService";

interface StepResult {
  refinedText?: string;
  analysis?: ProcessingAnalysis;
  entities?: {
    people: PersonEntity[];
    organizations: OrganizationEntity[];
    locations: LocationEntity[];
    events: EventEntity[];
  };
  timeline?: TimelineEvent[];
}

export class PodcastProcessingStrategy extends BaseProcessingStrategy<
  string,
  ProcessingResult
> {
  private stepResults: Map<string, StepResult> = new Map();

  protected initializeSteps(): void {
    this.state.steps = [
      {
        id: "transcript",
        name: "Transcript Processing",
        status: "pending",
        progress: 0,
      },
      {
        id: "analysis",
        name: "Content Analysis",
        status: "pending",
        progress: 0,
      },
      {
        id: "metadata",
        name: "Metadata Generation",
        status: "pending",
        progress: 0,
      },
      {
        id: "timeline",
        name: "Timeline Analysis",
        status: "pending",
        progress: 0,
      },
      {
        id: "finalize",
        name: "Finalization",
        status: "pending",
        progress: 0,
      },
    ];
  }

  public async processStep(stepId: string): Promise<void> {
    const step = this.getStepById(stepId);
    if (!step) {
      throw new Error(`Step ${stepId} not found`);
    }

    try {
      await this.validateDependencies(stepId);
      step.status = "processing";

      switch (stepId) {
        case "transcript":
          await this.processTranscript();
          break;
        case "analysis":
          await this.analyzeContent();
          break;
        case "metadata":
          await this.generateMetadata();
          break;
        case "timeline":
          await this.analyzeTimeline();
          break;
        case "finalize":
          await this.finalize();
          break;
        default:
          throw new Error(`Unknown step: ${stepId}`);
      }

      step.status = "completed";
      step.progress = 100;
      this.updateOverallProgress();
    } catch (error) {
      this.handleStepError(stepId, error as Error);
    }
  }

  public async process(input: string): Promise<ProcessingResult> {
    try {
      await this.validateInput(input);
      this.state.currentTranscript = input;
      this.initializeSteps();

      for (const step of this.state.steps) {
        await this.processStep(step.id);
      }

      const result = await this.createProcessingResult();
      return result;
    } catch (error) {
      logger.error("Processing failed:", error as Error);
      throw error;
    }
  }

  public updateStepStatus(
    stepId: string,
    status: ProcessingStatus,
    data?: unknown
  ): void {
    const step = this.getStepById(stepId);
    if (step) {
      step.status = status;
      if (data) {
        step.result = data;
      }
      this.updateOverallProgress();
    }
  }

  public async combine(results: ProcessingResult[]): Promise<ProcessingResult> {
    if (results.length === 0) {
      throw new Error("No results to combine");
    }

    if (results.length === 1) {
      return results[0];
    }

    // Combine the results into a single result
    const combinedResult: ProcessingResult = {
      id: crypto.randomUUID(),
      status: "completed",
      success: true,
      output: results.map((r) => r.output).join("\n"),
      metadata: results[0].metadata,
      analysis: this.combineAnalysis(
        results
          .map((r) => r.analysis)
          .filter((a): a is ProcessingAnalysis => !!a)
      ),
      transcript: results
        .map((r) => r.transcript)
        .filter(Boolean)
        .join("\n"),
      chunks: results.flatMap((r) => r.chunks || []),
      entities: this.combineEntities(
        results
          .map((r) => r.entities)
          .filter((e): e is NonNullable<ProcessingResult["entities"]> => !!e)
      ),
      timeline: results.flatMap((r) => r.timeline || []),
    };

    return combinedResult;
  }

  public validate(input: string): boolean {
    return Boolean(input && input.trim().length > 0);
  }

  private async validateInput(input: string): Promise<boolean> {
    if (!input || input.trim().length === 0) {
      throw new Error("Input transcript cannot be empty");
    }
    return true;
  }

  protected validateDependencies(stepId: string): boolean {
    const step = this.getStepById(stepId);
    if (!step) return false;

    const dependencies: Record<string, string[]> = {
      transcript: [],
      analysis: ["transcript"],
      metadata: ["analysis"],
      timeline: ["analysis"],
      finalize: ["metadata", "timeline"],
    };

    const stepDeps = dependencies[stepId] || [];
    for (const depId of stepDeps) {
      const depStep = this.getStepById(depId);
      if (!depStep || depStep.status !== "completed") {
        return false;
      }
    }

    return true;
  }

  protected handleStepError(stepId: string, error: Error): void {
    logger.error(`Error in step ${stepId}:`, error);
    this.setStepError(stepId, error);
  }

  protected setStepError(stepId: string, error: Error): void {
    const step = this.getStepById(stepId);
    if (step) {
      step.status = "error";
      step.error = error.message;
      this.state.error = error.message;
      this.state.status = "error";
    }
  }

  protected cleanup(): void {
    this.stepResults.clear();
  }

  private async processTranscript(): Promise<void> {
    // Implementation
  }

  private async analyzeContent(): Promise<void> {
    // Implementation
  }

  private async generateMetadata(): Promise<void> {
    // Implementation
  }

  private async analyzeTimeline(): Promise<void> {
    // Implementation
  }

  private async finalize(): Promise<void> {
    // Implementation
  }

  private async createProcessingResult(): Promise<ProcessingResult> {
    return {
      id: crypto.randomUUID(),
      status: this.state.status,
      success: this.state.status === "completed",
      output: this.state.currentTranscript,
      error: this.state.error,
      metadata: {
        format: "podcast",
        platform: "default",
        processedAt: new Date().toISOString(),
      },
      analysis: undefined,
      transcript: this.state.currentTranscript,
      chunks: this.state.chunks,
    };
  }

  private combineAnalysis(
    analyses: ProcessingAnalysis[]
  ): ProcessingAnalysis | undefined {
    if (analyses.length === 0) return undefined;

    return {
      id: crypto.randomUUID(),
      title: "Combined Analysis",
      summary: analyses
        .map((a) => a.summary)
        .filter(Boolean)
        .join("\n"),
      entities: this.combineEntities(
        analyses
          .map((a) => a.entities)
          .filter((e): e is NonNullable<ProcessingResult["entities"]> => !!e)
      ),
      timeline: analyses.flatMap((a) => a.timeline || []),
      sentiment: analyses[0]?.sentiment,
      topics: analyses.flatMap((a) => a.topics || []),
      themes: Array.from(new Set(analyses.flatMap((a) => a.themes || []))),
      keyPoints: analyses.flatMap((a) => a.keyPoints || []),
      quickFacts: analyses[0]?.quickFacts,
    };
  }

  private combineEntities(
    entitiesList: Array<NonNullable<ProcessingResult["entities"]>>
  ) {
    if (entitiesList.length === 0) return undefined;

    return {
      people: Array.from(new Set(entitiesList.flatMap((e) => e.people || []))),
      organizations: Array.from(
        new Set(entitiesList.flatMap((e) => e.organizations || []))
      ),
      locations: Array.from(
        new Set(entitiesList.flatMap((e) => e.locations || []))
      ),
      events: Array.from(new Set(entitiesList.flatMap((e) => e.events || []))),
      topics: Array.from(new Set(entitiesList.flatMap((e) => e.topics || []))),
      concepts: Array.from(
        new Set(entitiesList.flatMap((e) => e.concepts || []))
      ),
    };
  }
}
