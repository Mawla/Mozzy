export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

export interface LogSummary {
  totalLogs: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  debugCount: number;
  lastError?: LogEntry;
  lastWarning?: LogEntry;
}

export interface ProcessingLogger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: Error, data?: any): void;
  getLogs(): LogEntry[];
  getLogSummary(): LogSummary;
  clearLogs(): void;
}
