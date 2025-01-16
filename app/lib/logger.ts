export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
  source?: "browser" | "server";
  url?: string;
  userAgent?: string;
}

export interface LogFile {
  name: string;
  path: string;
  size: number;
  created: Date;
}

export interface LogSummary {
  totalEntries: number;
  errorCount: number;
  warnCount: number;
  lastError?: LogEntry;
  recentLogs: LogEntry[];
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

  private formatLog(
    level: LogLevel,
    message: string,
    data?: any,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    };
  }

  private addLog(entry: LogEntry) {
    // Console output
    console[entry.level](
      `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
      entry.data ? { data: entry.data } : "",
      entry.error ? { error: entry.error } : ""
    );

    // Memory storage
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Send to server if in browser
    if (typeof window !== "undefined" && entry.source === "browser") {
      this.sendToServer(entry);
    }
  }

  private async sendToServer(entry: LogEntry) {
    try {
      await fetch("/api/debug/logs/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entry }),
      });
    } catch (error) {
      console.error("Failed to send log to server:", error);
    }
  }

  setupBrowserErrorCapture() {
    if (typeof window === "undefined") return;

    // Capture unhandled errors
    window.addEventListener("error", (event) => {
      this.error(
        "Unhandled browser error",
        event.error || new Error(event.message),
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          source: "browser",
          url: window.location.href,
          userAgent: window.navigator.userAgent,
        }
      );
      return false;
    });

    // Capture unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));
      this.error("Unhandled promise rejection", error, {
        source: "browser",
        url: window.location.href,
        userAgent: window.navigator.userAgent,
      });
      return false;
    });

    // Capture console methods
    const consoleMethods: LogLevel[] = ["debug", "info", "warn", "error"];
    consoleMethods.forEach((level) => {
      const originalMethod = console[level];
      console[level] = (...args: any[]) => {
        // Call original method
        originalMethod.apply(console, args);

        // Log to our system
        const message = args
          .map((arg) =>
            typeof arg === "string"
              ? arg
              : arg instanceof Error
              ? arg.message
              : JSON.stringify(arg)
          )
          .join(" ");

        const error = args.find((arg) => arg instanceof Error) || undefined;

        this.addLog({
          timestamp: new Date().toISOString(),
          level,
          message,
          error,
          source: "browser",
          url: window.location.href,
          userAgent: window.navigator.userAgent,
        });
      };
    });
  }

  debug(message: string, data?: any) {
    this.addLog(this.formatLog("debug", message, data));
  }

  info(message: string, data?: any) {
    this.addLog(this.formatLog("info", message, data));
  }

  warn(message: string, data?: any) {
    this.addLog(this.formatLog("warn", message, data));
  }

  error(message: string, error?: Error, data?: any) {
    this.addLog(this.formatLog("error", message, data, error));
  }

  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = level
      ? this.logs.filter((log) => log.level === level)
      : this.logs;
    return limit ? filteredLogs.slice(-limit) : filteredLogs;
  }

  getLogSummary(): LogSummary {
    const errorLogs = this.logs.filter((log) => log.level === "error");
    const warnLogs = this.logs.filter((log) => log.level === "warn");

    return {
      totalEntries: this.logs.length,
      errorCount: errorLogs.length,
      warnCount: warnLogs.length,
      lastError: errorLogs[errorLogs.length - 1],
      recentLogs: this.logs.slice(-10), // Last 10 logs
    };
  }

  getLogsByTimeRange(startTime: Date, endTime: Date): LogEntry[] {
    return this.logs.filter((log) => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
  }

  searchLogs(
    searchTerm: string,
    options: {
      caseSensitive?: boolean;
      level?: LogLevel;
      limit?: number;
    } = {}
  ): LogEntry[] {
    const { caseSensitive = false, level, limit } = options;

    let filteredLogs = this.logs;

    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level === level);
    }

    filteredLogs = filteredLogs.filter((log) => {
      const term = caseSensitive ? searchTerm : searchTerm.toLowerCase();
      const message = caseSensitive ? log.message : log.message.toLowerCase();
      return message.includes(term);
    });

    return limit ? filteredLogs.slice(-limit) : filteredLogs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();

// Add some test logs
logger.info("Application started");
logger.debug("Initializing components");
logger.warn("Cache miss for user preferences");
logger.error(
  "Failed to load configuration",
  new Error("Config file not found")
);
logger.info("Using default configuration");
logger.debug("Components initialized successfully");
