"use client";

import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";
import type { LogEntry, LogLevel, LogFile } from "@/lib/logger";

interface LogsViewerProps {
  level?: LogLevel;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  showFileSelector?: boolean;
}

export function LogsViewer({
  level,
  limit = 100,
  autoRefresh = true,
  refreshInterval = 5000,
  showFileSelector = false,
}: LogsViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>(logger.getLogs(level, limit));
  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");

  useEffect(() => {
    if (showFileSelector) {
      fetchLogFiles();
    }
  }, [showFileSelector]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (selectedFile) {
        fetchFileContent(selectedFile);
      } else {
        setLogs(logger.getLogs(level, limit));
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, level, limit, selectedFile]);

  const fetchLogFiles = async () => {
    try {
      const response = await fetch("/api/debug/logs/files");
      const data = await response.json();
      if (data.files) {
        setLogFiles(data.files);
      }
    } catch (error) {
      console.error("Failed to fetch log files:", error);
    }
  };

  const fetchFileContent = async (filePath: string) => {
    try {
      const response = await fetch(
        `/api/debug/logs/files?path=${encodeURIComponent(filePath)}`
      );
      const data = await response.json();
      if (data.content) {
        setFileContent(data.content);
      }
    } catch (error) {
      console.error("Failed to fetch file content:", error);
    }
  };

  const handleFileSelect = async (filePath: string) => {
    setSelectedFile(filePath);
    if (filePath) {
      await fetchFileContent(filePath);
    } else {
      setFileContent("");
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "debug":
        return "text-gray-500";
      case "info":
        return "text-blue-500";
      case "warn":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-700";
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-4">
      {showFileSelector && (
        <div className="flex items-center gap-4">
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedFile}
            onChange={(e) => handleFileSelect(e.target.value)}
          >
            <option value="">Live Logs</option>
            {logFiles.map((file) => (
              <option key={file.path} value={file.path}>
                {file.name} ({formatBytes(file.size)})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-background rounded-lg border p-4">
        <div className="space-y-2">
          {selectedFile ? (
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {fileContent}
            </pre>
          ) : (
            logs.map((log: LogEntry, index: number) => (
              <div key={index} className="font-mono text-sm">
                <span className="text-gray-400">{log.timestamp}</span>{" "}
                <span className={getLevelColor(log.level)}>
                  [{log.level.toUpperCase()}]
                </span>{" "}
                <span className="text-foreground">{log.message}</span>
                {log.data && (
                  <pre className="mt-1 text-xs text-muted-foreground">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
                {log.error && (
                  <pre className="mt-1 text-xs text-red-500">
                    {log.error.stack || log.error.message}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
