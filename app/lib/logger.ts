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

  static getInstance(): Logger {
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

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // In development, also log to console
    if (process.env.NODE_ENV === "development") {
      const consoleMethod =
        level === "error" ? "error" : level === "warn" ? "warn" : "log";
      console[consoleMethod](message, error || "", data || "");
    }
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

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogSummary() {
    return {
      total: this.logs.length,
      errors: this.logs.filter((log) => log.level === "error").length,
      warnings: this.logs.filter((log) => log.level === "warn").length,
      lastLog: this.logs[this.logs.length - 1],
    };
  }
}

export const logger = Logger.getInstance();
