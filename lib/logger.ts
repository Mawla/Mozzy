type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
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

  public getLogSummary() {
    const errorCount = this.logs.filter((log) => log.level === "error").length;
    const warningCount = this.logs.filter((log) => log.level === "warn").length;
    const lastError = this.logs.find((log) => log.level === "error");
    const lastWarning = this.logs.find((log) => log.level === "warn");

    return {
      totalLogs: this.logs.length,
      errorCount,
      warningCount,
      lastError,
      lastWarning,
    };
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
