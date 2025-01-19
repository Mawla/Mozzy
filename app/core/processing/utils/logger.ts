export interface ProcessingLogger {
  debug: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, error?: Error, data?: any) => void;
  getLogs: () => Array<{
    timestamp: string;
    level: "debug" | "info" | "warn" | "error";
    message: string;
    data?: any;
    error?: Error;
  }>;
}

class Logger implements ProcessingLogger {
  private logs: Array<{
    timestamp: string;
    level: "debug" | "info" | "warn" | "error";
    message: string;
    data?: any;
    error?: Error;
  }> = [];

  private log(
    level: "debug" | "info" | "warn" | "error",
    message: string,
    error?: Error,
    data?: any
  ) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    };
    this.logs.push(logEntry);
    console[level](message, ...(data ? [data] : []), ...(error ? [error] : []));
  }

  debug(message: string, data?: any) {
    this.log("debug", message, undefined, data);
  }

  info(message: string, data?: any) {
    this.log("info", message, undefined, data);
  }

  warn(message: string, data?: any) {
    this.log("warn", message, undefined, data);
  }

  error(message: string, error?: Error, data?: any) {
    this.log("error", message, error, data);
  }

  getLogs() {
    return this.logs;
  }
}

export const logger = new Logger();
