import {
  ProcessingState,
  ProcessingStep,
  ProcessingStatus,
  BaseTextChunk,
  NetworkLog,
} from "@/app/types/processing/base";

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

export interface BaseInput {
  // Minimum fields required by the generic type
  id: string;
  title?: string;
  // You can add fields as needed
}

export interface ProcessingStrategy<TInput, TOutput> {
  // Core methods
  getState(): ProcessingState;
  process(input: TInput): Promise<TOutput>;

  // Step management
  processStep(stepId: string): Promise<void>;
  getStepById(stepId: string): ProcessingStep | undefined;

  // Status updates with proper type safety
  updateStepStatus(
    stepId: string,
    status: ProcessingStatus,
    data?: unknown
  ): void;

  // Optional combine method with proper type constraints
  combine?(results: TOutput[]): Promise<TOutput>;
}

export abstract class BaseProcessingStrategy<TInput, TOutput>
  implements ProcessingStrategy<TInput, TOutput>
{
  protected state: ProcessingState;

  constructor() {
    this.state = {
      status: "idle",
      overallProgress: 0,
      steps: [],
      chunks: [],
      networkLogs: [],
      currentTranscript: "",
      error: undefined,
    };
  }

  public getState(): ProcessingState {
    return this.state;
  }

  public getStepById(stepId: string): ProcessingStep | undefined {
    return this.state.steps.find((step: ProcessingStep) => step.id === stepId);
  }

  public abstract processStep(stepId: string): Promise<void>;
  public abstract process(input: TInput): Promise<TOutput>;

  public updateStepStatus(
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
      this.updateOverallProgress();
    }
  }

  protected updateStepProgress(stepId: string, progress: number): void {
    const step = this.getStepById(stepId);
    if (step) {
      step.progress = Math.min(100, Math.max(0, progress));
      this.updateOverallProgress();
    }
  }

  protected updateOverallProgress(): void {
    const totalSteps = this.state.steps.length;
    if (totalSteps === 0) {
      this.state.overallProgress = 0;
      return;
    }

    const completedProgress = this.state.steps.reduce(
      (sum, step) => sum + (step.progress || 0),
      0
    );
    this.state.overallProgress = Math.round(completedProgress / totalSteps);
  }

  protected logNetworkError(message: string, error: unknown): void {
    const errorLog: NetworkLog = {
      timestamp: new Date().toISOString(),
      type: "error",
      message,
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    };
    this.state.networkLogs.push(errorLog);
  }

  protected logRequest(message: string, data?: unknown): void {
    const requestLog: NetworkLog = {
      timestamp: new Date().toISOString(),
      type: "request",
      message,
      data,
    };
    this.state.networkLogs.push(requestLog);
  }

  protected logResponse(message: string, data?: unknown): void {
    const responseLog: NetworkLog = {
      timestamp: new Date().toISOString(),
      type: "response",
      message,
      data,
    };
    this.state.networkLogs.push(responseLog);
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

  public abstract validate(input: string): boolean;

  public abstract combine?(results: TOutput[]): Promise<TOutput>;

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
      step.error = error instanceof Error ? error : new Error(String(error));
      throw error;
    } finally {
      this.updateOverallProgress();
    }
  }
}
