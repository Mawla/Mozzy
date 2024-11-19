import { ProcessingState, ProcessingStep } from "../types";

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

export abstract class ProcessingStrategy<TInput, TOutput> {
  protected state: ProcessingState;

  constructor() {
    this.state = {
      id: generateId(),
      steps: this.defineSteps(),
      currentStep: 0,
      overallProgress: 0,
      status: "idle",
    };
  }

  protected abstract defineSteps(): ProcessingStep[];

  public abstract process(chunk: TInput): Promise<TOutput>;

  public abstract validate(input: TInput): boolean;

  public abstract combine?(results: TOutput[]): Promise<TOutput>;

  protected updateProgress(stepId: string, progress: number): void {
    const step = this.state.steps.find((s) => s.id === stepId);
    if (step) {
      step.progress = progress;
      this.updateOverallProgress();
    }
  }

  protected updateOverallProgress(): void {
    const totalProgress = this.state.steps.reduce(
      (sum, step) => sum + step.progress,
      0
    );
    this.state.overallProgress = totalProgress / this.state.steps.length;
  }

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
