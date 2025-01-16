export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: {
    name?: string;
    message: string;
    stack?: string;
    [key: string]: any;
  };
  source?: "browser" | "server";
  url?: string;
  userAgent?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private logQueue: LogEntry[] = [];
  private maxLogs: number = 1000;
  private isConsoleOverride: boolean = false;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private originalConsole: Record<string, (...args: any[]) => void> | null =
    null;
  private queueProcessor: number | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      this.initializationPromise = this.initialize();
    } else {
      this.setupServerLogging();
    }
  }

  private async initialize() {
    if (this.isInitialized) return;

    try {
      await this.setupBrowserLogging();
      this.isInitialized = true;
    } catch (err) {
      console.error("Failed to initialize logger:", err);
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Internal logging - never touches console
  private async internalLog(entry: LogEntry) {
    // Wait for initialization if needed
    if (this.initializationPromise) {
      await this.initializationPromise;
    }

    // Ensure timestamp
    if (!entry.timestamp) {
      entry.timestamp = new Date().toISOString();
    }

    // Ensure source
    if (!entry.source) {
      entry.source = typeof window !== "undefined" ? "browser" : "server";
    }

    // Store in memory
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Queue for server if browser-side
    if (entry.source === "browser") {
      this.logQueue.push(entry);
      this.ensureQueueProcessing();
    } else {
      // Server-side: write directly to file
      await this.writeToFile(entry);
    }
  }

  private ensureQueueProcessing() {
    if (this.queueProcessor === null) {
      this.queueProcessor = window.setTimeout(() => {
        this.processQueue();
      }, 1000);
    }
  }

  private async processQueue() {
    this.queueProcessor = null;

    if (this.logQueue.length === 0) return;

    const entry = this.logQueue.shift();
    if (!entry) return;

    try {
      const response = await fetch("/api/debug/logs/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.simplifyForJSON(entry)),
        credentials: "include",
      });

      if (!response.ok && this.originalConsole) {
        this.originalConsole.error("Failed to send log to server:", {
          status: response.status,
          statusText: response.statusText,
        });
      }
    } catch (err) {
      if (this.originalConsole) {
        this.originalConsole.error("Error sending log to server");
      }
    }

    // Process next item if queue not empty
    if (this.logQueue.length > 0) {
      this.ensureQueueProcessing();
    }
  }

  private simplifyForJSON(obj: any): any {
    const seen = new WeakSet();

    const simplify = (value: any): any => {
      if (value === null || value === undefined) {
        return value;
      }

      if (typeof value === "object") {
        if (seen.has(value)) {
          return "[Circular Reference]";
        }

        if (value instanceof Error) {
          return {
            errorType: value.name,
            errorMessage: value.message,
            stackTrace: value.stack,
          };
        }

        if (Array.isArray(value)) {
          seen.add(value);
          return value.map((item) => simplify(item));
        }

        seen.add(value);
        const result: Record<string, any> = {};
        for (const key of Object.keys(value)) {
          try {
            result[key] = simplify(value[key]);
          } catch (err) {
            result[key] = "[Unable to serialize]";
          }
        }
        return result;
      }

      return value;
    };

    return simplify(obj);
  }

  public getLogs(): LogEntry[] {
    return this.logs;
  }

  public getLogSummary() {
    const summary = {
      total: this.logs.length,
      byLevel: {
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
      },
      recentErrors: [] as LogEntry[],
    };

    // Count logs by level and collect recent errors
    this.logs.forEach((log) => {
      summary.byLevel[log.level]++;
      if (log.level === "error") {
        summary.recentErrors.push(log);
      }
    });

    // Keep only the last 5 errors
    summary.recentErrors = summary.recentErrors.slice(-5);

    return summary;
  }

  private createConsoleOverride(
    method: keyof typeof console,
    logLevel: LogLevel
  ) {
    return (...args: any[]) => {
      if (!this.isConsoleOverride && this.originalConsole) {
        this.isConsoleOverride = true;
        try {
          // First call original console to maintain proper stack traces
          this.originalConsole[method](...args);

          // Then log to internal system
          const safeArgs = args.map((arg) => {
            try {
              return this.simplifyForJSON(arg);
            } catch (err) {
              return "[Unable to serialize]";
            }
          });

          this.internalLog({
            level: logLevel,
            message: `Console.${method}`,
            data: { args: safeArgs },
            timestamp: new Date().toISOString(),
          });
        } finally {
          this.isConsoleOverride = false;
        }
      } else if (this.originalConsole) {
        // Direct pass-through if already in override
        this.originalConsole[method](...args);
      }
    };
  }

  public setupBrowserLogging() {
    if (typeof window === "undefined") return;

    // Only set up once
    if (this.originalConsole) return;

    // Store original console methods
    this.originalConsole = {
      log: console.log.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      debug: console.debug.bind(console),
    };

    // Apply console overrides
    console.debug = this.createConsoleOverride("debug", "debug");
    console.log = this.createConsoleOverride("log", "info");
    console.info = this.createConsoleOverride("info", "info");
    console.warn = this.createConsoleOverride("warn", "warn");
    console.error = this.createConsoleOverride("error", "error");

    // Error handlers
    window.addEventListener("error", (event) => {
      if (!this.isConsoleOverride) {
        this.isConsoleOverride = true;
        try {
          this.internalLog({
            level: "error",
            message: "Unhandled browser error",
            error: this.simplifyForJSON({
              name: "Error",
              message: event.message,
              stack: event.error?.stack,
            }),
            data: this.simplifyForJSON({
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
            }),
            timestamp: new Date().toISOString(),
          });
        } finally {
          this.isConsoleOverride = false;
        }
      }
    });

    window.addEventListener("unhandledrejection", (event) => {
      if (!this.isConsoleOverride) {
        this.isConsoleOverride = true;
        try {
          const error =
            event.reason instanceof Error
              ? event.reason
              : new Error(String(event.reason));
          this.internalLog({
            level: "error",
            message: "Unhandled promise rejection",
            error: this.simplifyForJSON({
              name: error.name,
              message: error.message,
              stack: error.stack,
            }),
            timestamp: new Date().toISOString(),
          });
        } finally {
          this.isConsoleOverride = false;
        }
      }
    });
  }

  private async writeToFile(logEntry: LogEntry) {
    if (typeof window !== "undefined") {
      // Client-side: use API
      try {
        const response = await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(logEntry),
        });
        if (!response.ok) {
          console.error("Failed to send log to server:", response.statusText);
        }
      } catch (err) {
        console.error("Error sending log to server:", err);
      }
    } else {
      // Server-side: use direct file system access
      try {
        const { writeFile } = require("fs/promises");
        const { join } = require("path");
        const logDir = join(process.cwd(), "logs");
        const logFile = join(
          logDir,
          `app-${new Date().toISOString().split("T")[0]}.log`
        );
        await writeFile(logFile, JSON.stringify(logEntry) + "\n", {
          flag: "a",
        });
      } catch (err) {
        console.error("Failed to write log to file:", err);
      }
    }
  }

  public setupServerLogging() {
    if (typeof window !== "undefined") return;

    // Capture unhandled exceptions
    process.on("uncaughtException", async (error: Error) => {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "error" as const,
        message: "Uncaught Exception",
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        source: "server",
      };

      await this.writeToFile(logEntry);
      this.error("Uncaught Exception", error);
    });

    // Capture unhandled promise rejections
    process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
      this.error("Unhandled Promise Rejection", reason);
    });

    // Override console methods for server
    console.error = this.createConsoleOverride("error", "error");
    console.warn = this.createConsoleOverride("warn", "warn");
    console.info = this.createConsoleOverride("info", "info");
    console.debug = this.createConsoleOverride("debug", "debug");
    console.log = this.createConsoleOverride("log", "info");
  }

  // Public API
  public debug(message: string, data?: any) {
    this.internalLog({
      level: "debug",
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  public info(message: string, data?: any) {
    this.internalLog({
      level: "info",
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  public warn(message: string, data?: any) {
    this.internalLog({
      level: "warn",
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  public error(message: string, error?: any, data?: any) {
    this.internalLog({
      level: "error",
      message,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}

export const logger = Logger.getInstance();
