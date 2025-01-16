export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000; // Keep last 1000 logs in memory

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
    console[entry.level](
      `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
      entry.data ? { data: entry.data } : "",
      entry.error ? { error: entry.error } : ""
    );

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
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

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
