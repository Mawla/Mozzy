import fs from "fs";
import path from "path";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
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
  private logDir: string;
  private currentLogFile: string;

  private constructor() {
    this.logDir = path.join(process.cwd(), "logs");
    this.currentLogFile = path.join(
      this.logDir,
      `app-${new Date().toISOString().split("T")[0]}.log`
    );
    this.initializeLogDirectory();
  }

  private initializeLogDirectory() {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch (error) {
      console.error("Failed to create logs directory:", error);
    }
  }

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

  private formatLogForFile(entry: LogEntry): string {
    const base = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${
      entry.message
    }`;
    const data = entry.data
      ? `\nData: ${JSON.stringify(entry.data, null, 2)}`
      : "";
    const error = entry.error
      ? `\nError: ${entry.error.stack || entry.error.message}`
      : "";
    return `${base}${data}${error}\n`;
  }

  private writeToFile(entry: LogEntry) {
    try {
      const logDate = new Date().toISOString().split("T")[0];
      const logFile = path.join(this.logDir, `app-${logDate}.log`);

      // If date changed, update current log file
      if (logFile !== this.currentLogFile) {
        this.currentLogFile = logFile;
      }

      fs.appendFileSync(this.currentLogFile, this.formatLogForFile(entry));
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
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

    // File storage
    this.writeToFile(entry);
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

  getLogFiles(): LogFile[] {
    try {
      const files = fs
        .readdirSync(this.logDir)
        .filter((file) => file.endsWith(".log"))
        .map((file) => {
          const filePath = path.join(this.logDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: filePath,
            size: stats.size,
            created: stats.birthtime,
          };
        })
        .sort((a, b) => b.created.getTime() - a.created.getTime());

      return files;
    } catch (error) {
      console.error("Failed to read log files:", error);
      return [];
    }
  }

  readLogFile(filePath: string, maxLines: number = 1000): string {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error("Log file does not exist");
      }

      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n").filter(Boolean);
      return lines.slice(-maxLines).join("\n");
    } catch (error) {
      console.error("Failed to read log file:", error);
      return "";
    }
  }

  getLogFilePath(): string {
    return this.currentLogFile;
  }

  clearLogs() {
    this.logs = [];
  }

  /**
   * Get a summary of logs for quick review by the Cursor agent
   * Includes total entries, error counts, and recent logs
   */
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

  /**
   * Get logs from a specific time range
   * Useful for reviewing logs during a specific operation or debugging session
   */
  getLogsByTimeRange(startTime: Date, endTime: Date): LogEntry[] {
    return this.logs.filter((log) => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
  }

  /**
   * Search logs for specific terms or patterns
   * Helps in finding relevant log entries quickly
   */
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
}

export const logger = Logger.getInstance();
