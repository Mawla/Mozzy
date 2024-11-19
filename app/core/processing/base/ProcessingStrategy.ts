import { ProcessingState, ProcessingStep, ProcessingResult } from "../types";

export abstract class ProcessingStrategy<TInput, TOutput> {
  protected state: ProcessingState;

  constructor() {
    this.state = {
      id: crypto.randomUUID(),
      steps: this.defineSteps(),
      currentStep: 0,
      overallProgress: 0,
      status: "idle",
    };
  }

  protected abstract defineSteps(): ProcessingStep[];

  public abstract process(input: TInput): Promise<TOutput>;

  public abstract validate(input: TInput): boolean;

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
