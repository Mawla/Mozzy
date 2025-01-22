import type {
  LogLevel,
  LogEntry,
  LogSummary,
  ProcessingLogger,
} from "@/app/types/logging";

class Logger implements ProcessingLogger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, error?: Error, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      const consoleMethod = console[level] || console.log;
      consoleMethod(
        `[${level.toUpperCase()}] ${message}`,
        error || "",
        data || ""
      );
    }
  }

  public debug(message: string, data?: any) {
    this.log("debug", message, undefined, data);
  }

  public info(message: string, data?: any) {
    this.log("info", message, undefined, data);
  }

  public warn(message: string, data?: any) {
    this.log("warn", message, undefined, data);
  }

  public error(message: string, error?: Error, data?: any) {
    this.log("error", message, error, data);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public getLogSummary(): LogSummary {
    const summary: LogSummary = {
      totalLogs: this.logs.length,
      errorCount: 0,
      warnCount: 0,
      infoCount: 0,
      debugCount: 0,
    };

    for (const log of this.logs) {
      switch (log.level) {
        case "error":
          summary.errorCount++;
          if (!summary.lastError) summary.lastError = log;
          break;
        case "warn":
          summary.warnCount++;
          if (!summary.lastWarning) summary.lastWarning = log;
          break;
        case "info":
          summary.infoCount++;
          break;
        case "debug":
          summary.debugCount++;
          break;
      }
    }

    return summary;
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
