import { ProcessingState, ProcessingStep } from "../types/base";

// Polyfill for crypto.randomUUID in test environment
const generateId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export abstract class ProcessingStrategy {
  protected state: ProcessingState;

  constructor() {
    this.state = {
      status: "pending",
      overallProgress: 0,
      steps: [],
      chunks: [],
      networkLogs: [],
      currentTranscript: "",
    };
  }

  protected abstract initializeSteps(): void;

  protected abstract validateInput(input: string): Promise<boolean>;

  protected abstract processStep(stepId: string): Promise<void>;

  protected getStepById(stepId: string): ProcessingStep | undefined {
    return this.state.steps.find((step) => step.id === stepId);
  }

  protected updateStepProgress(stepId: string, progress: number): void {
    const step = this.getStepById(stepId);
    if (step) {
      step.progress = progress;
      this.updateOverallProgress();
    }
  }

  protected updateOverallProgress(): void {
    const totalProgress = this.state.steps.reduce(
      (sum: number, step: ProcessingStep) => sum + step.progress,
      0
    );
    this.state.overallProgress = totalProgress / this.state.steps.length;
  }

  protected updateStepStatus(
    stepId: string,
    status: ProcessingStep["status"]
  ): void {
    const step = this.getStepById(stepId);
    if (step) {
      step.status = status;
    }
  }

  protected setStepError(stepId: string, error: Error): void {
    const step = this.getStepById(stepId);
    if (step) {
      step.error = error;
      step.status = "failed";
    }
  }

  protected abstract validateDependencies(stepId: string): boolean;

  protected abstract handleStepError(stepId: string, error: Error): void;

  protected abstract cleanup(): void;

  public abstract process(chunk: string): Promise<void>;

  public abstract validate(input: string): boolean;

  public abstract combine?(results: string[]): Promise<string>;

  public getState(): ProcessingState {
    return { ...this.state };
  }

  protected async executeStep<T>(
    stepId: string,
    executor: () => Promise<T>
  ): Promise<T> {
    const step = this.state.steps.find((s) => s.id === stepId);
    if (!step) throw new Error(`Unknown step: ${stepId}`);

    try {
      step.status = "processing";
      const result = await executor();
      step.status = "completed";
      step.progress = 100;
      return result;
    } catch (error) {
      step.status = "failed";
      step.error = error as Error;
      throw error;
    } finally {
      this.updateOverallProgress();
    }
  }
}
