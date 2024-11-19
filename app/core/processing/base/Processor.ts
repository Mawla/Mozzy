export abstract class Processor<T, R> {
  abstract process(input: T): Promise<R>;
  abstract validateInput(input: T): boolean;
  abstract validateOutput(output: R): boolean;

  protected async safeProcess(input: T): Promise<R> {
    if (!this.validateInput(input)) {
      throw new Error("Invalid input");
    }

    const result = await this.process(input);

    if (!this.validateOutput(result)) {
      throw new Error("Invalid output");
    }

    return result;
  }
}
