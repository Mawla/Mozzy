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

  private constructor() {}

  public static getInstance(): ProcessingLogger {
    if (!ProcessingLogger.instance) {
      ProcessingLogger.instance = new ProcessingLogger();
    }
    return ProcessingLogger.instance;
  }

  log(level: LogLevel, message: string, error?: unknown, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error: error instanceof Error ? error : new Error(String(error)),
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

  warn(message: string, error?: unknown, data?: any) {
    this.log("warn", message, error, data);
  }

  error(message: string, error?: unknown, data?: any) {
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
