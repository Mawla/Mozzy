export type LogLevel = "debug" | "info" | "warn" | "error";

export class ProcessingLogger {
  static log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data }),
    };

    switch (level) {
      case "debug":
        console.debug(logEntry);
        break;
      case "info":
        console.info(logEntry);
        break;
      case "warn":
        console.warn(logEntry);
        break;
      case "error":
        console.error(logEntry);
        break;
    }
  }
}
