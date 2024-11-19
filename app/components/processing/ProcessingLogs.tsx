import { ScrollArea } from "@/components/ui/scroll-area";

interface ProcessingLogsProps {
  logs: Array<{
    level: string;
    message: string;
    timestamp: string;
  }>;
}

export function ProcessingLogs({ logs }: ProcessingLogsProps) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`p-2 rounded text-sm ${
              log.level === "error"
                ? "bg-red-50 text-red-700"
                : log.level === "warn"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-gray-50 text-gray-700"
            }`}
          >
            <span className="text-xs opacity-70">{log.timestamp}</span>
            <span className="ml-2">{log.message}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
