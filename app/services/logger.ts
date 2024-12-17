type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    data?: any
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // In development, also log to console
    if (process.env.NODE_ENV === "development") {
      const consoleMethod =
        entry.level === "error"
          ? "error"
          : entry.level === "warn"
          ? "warn"
          : entry.level === "debug"
          ? "debug"
          : "log";
      console[consoleMethod](
        `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
        entry.data || ""
      );
    }

    // TODO: In production, send logs to logging service
    // This could be implemented later with services like Sentry, LogRocket, etc.
  }

  info(message: string, data?: any) {
    const entry = this.formatMessage("info", message, data);
    this.addLog(entry);
  }

  warn(message: string, data?: any) {
    const entry = this.formatMessage("warn", message, data);
    this.addLog(entry);
  }

  error(message: string, error?: Error, data?: any) {
    const entry = {
      ...this.formatMessage("error", message, data),
      error,
    };
    this.addLog(entry);
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === "development") {
      const entry = this.formatMessage("debug", message, data);
      this.addLog(entry);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
