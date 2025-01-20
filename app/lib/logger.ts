export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

export interface LogFile {
  entries: LogEntry[];
  summary: {
    errorCount: number;
    warningCount: number;
    lastError?: LogEntry;
    lastWarning?: LogEntry;
  };
}

export class ProcessingLogger {
  private static instance: ProcessingLogger;
  private logs: LogEntry[] = [];
  private isBrowserLoggingSetup = false;

  private constructor() {}

  public static getInstance(): ProcessingLogger {
    if (!ProcessingLogger.instance) {
      ProcessingLogger.instance = new ProcessingLogger();
    }
    return ProcessingLogger.instance;
  }

  setupBrowserLogging() {
    if (this.isBrowserLoggingSetup) return;

    // Store original console methods
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    };

    // Override console methods
    console.log = (...args: any[]) => {
      this.debug(String(args[0]), args.slice(1));
      originalConsole.log.apply(console, args);
    };

    console.info = (...args: any[]) => {
      this.info(String(args[0]), args.slice(1));
      originalConsole.info.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const error = args[1] instanceof Error ? args[1] : undefined;
      this.warn(String(args[0]), error, args.slice(2));
      originalConsole.warn.apply(console, args);
    };

    console.error = (...args: any[]) => {
      const error = args[1] instanceof Error ? args[1] : undefined;
      this.error(String(args[0]), error, args.slice(2));
      originalConsole.error.apply(console, args);
    };

    console.debug = (...args: any[]) => {
      this.debug(String(args[0]), args.slice(1));
      originalConsole.debug.apply(console, args);
    };

    this.isBrowserLoggingSetup = true;
  }

  log(level: LogLevel, message: string, error?: Error | undefined, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      data,
    };
    this.logs.push(entry);
    console[level](message, error, data);
  }

  debug(message: string, data?: any) {
    this.log("debug", message, undefined, data);
  }

  info(message: string, data?: any) {
    this.log("info", message, undefined, data);
  }

  warn(message: string, error?: Error | undefined, data?: any) {
    this.log("warn", message, error, data);
  }

  error(message: string, error?: Error | undefined, data?: any) {
    this.log("error", message, error, data);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  getLogSummary(): LogFile["summary"] {
    const errorLogs = this.logs.filter((log) => log.level === "error");
    const warningLogs = this.logs.filter((log) => log.level === "warn");

    return {
      errorCount: errorLogs.length,
      warningCount: warningLogs.length,
      lastError: errorLogs[errorLogs.length - 1],
      lastWarning: warningLogs[warningLogs.length - 1],
    };
  }

  clearLogs() {
    this.logs = [];
  }
}

export const processingLogger = ProcessingLogger.getInstance();
export const logger = ProcessingLogger.getInstance();
