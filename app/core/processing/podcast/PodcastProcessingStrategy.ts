import {
  ProcessingStep,
  ProcessingState,
  ProcessingAnalysis,
  TimelineEvent,
  BaseProcessingResult,
  ChunkResult,
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
} from "../types/base";

import { ProcessingStrategy } from "../base/ProcessingStrategy";
import { logger } from "../utils/logger";
import { ProcessingError } from "../errors/ProcessingError";
import { podcastService } from "@/app/services/podcastService";
import {
  ProcessingStep as BaseProcessingStep,
  ProcessingAnalysis as BaseProcessingAnalysis,
  TimelineEvent as BaseTimelineEvent,
  BaseTextChunk,
} from "../types/base";

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

export class PodcastProcessingStrategy extends ProcessingStrategy {
  private stepResults: Map<string, StepResult> = new Map();

  protected initializeSteps(): void {
    this.state.steps = [
      {
        id: "transcript",
        name: "Transcript Processing",
        status: "pending",
        progress: 0,
        description: "Cleaning and formatting the transcript text",
      },
      {
        id: "analysis",
        name: "Content Analysis",
        status: "pending",
        progress: 0,
        description: "Generating summary and extracting key information",
      },
      {
        id: "metadata",
        name: "Metadata Generation",
        status: "pending",
        progress: 0,
        description: "Creating tags and content metadata",
      },
      {
        id: "timeline",
        name: "Timeline Analysis",
        status: "pending",
        progress: 0,
        description: "Detecting and organizing timeline events",
      },
      {
        id: "finalize",
        name: "Finalization",
        status: "pending",
        progress: 0,
        description: "Combining analysis, metadata, and events",
      },
    ];
  }

  protected async validateInput(input: string): Promise<boolean> {
    if (!input || input.trim().length === 0) {
      throw new Error("Input transcript cannot be empty");
    }
    return true;
  }

  protected async processStep(stepId: string): Promise<void> {
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

  public async process(input: string): Promise<void> {
    try {
      await this.validateInput(input);
      this.state.currentTranscript = input;
      this.initializeSteps();

      for (const step of this.state.steps) {
        await this.processStep(step.id);
      }
    } catch (error) {
      logger.error("Processing failed:", error as Error);
      throw error;
    }
  }

  public validate(input: string): boolean {
    return Boolean(input && input.trim().length > 0);
  }

  public async combine(results: string[]): Promise<string> {
    const parsedResults = results
      .map((result) => {
        try {
          return JSON.parse(result) as ChunkResult;
        } catch (error) {
          logger.error(
            "Failed to parse chunk result:",
            error instanceof Error ? error : new Error(String(error))
          );
          return null;
        }
      })
      .filter((result): result is ChunkResult => result !== null);

    const refinedText = parsedResults.map((r) => r.text).join(" ");

    const analysis: ProcessingAnalysis = {
      id: Date.now().toString(),
      title: "Combined Analysis",
      summary: "Combined summary of all chunks",
      entities: {
        people: Array.from(
          new Set(parsedResults.flatMap((r) => r.entities?.people || []))
        ),
        organizations: Array.from(
          new Set(parsedResults.flatMap((r) => r.entities?.organizations || []))
        ),
        locations: Array.from(
          new Set(parsedResults.flatMap((r) => r.entities?.locations || []))
        ),
        events: Array.from(
          new Set(parsedResults.flatMap((r) => r.entities?.events || []))
        ),
      },
      timeline: parsedResults.flatMap((r) => r.timeline || []),
    };

    return JSON.stringify({ refinedText, analysis });
  }
}
