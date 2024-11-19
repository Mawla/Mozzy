"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  ProcessingChunk,
  PodcastAnalysis,
  PodcastEntities,
  TimelineEvent,
} from "@/app/types/podcast/processing";
import { diff_match_patch, Diff } from "diff-match-patch";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { AnalysisSummary } from "./StepDetails/AnalysisSummary";
import { EntityList } from "./StepDetails/EntityList";
import { TimelineList } from "./StepDetails/TimelineList";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface ChunkVisualizerProps {
  chunks: ProcessingChunk[];
}

interface EntityItem {
  type: string;
  value: string;
}

const dmp = new diff_match_patch();

const StepProgress = ({
  label,
  status,
  data,
}: {
  label: string;
  status: "pending" | "processing" | "completed" | "error";
  data?: PodcastAnalysis | PodcastEntities | TimelineEvent[] | string | null;
}) => (
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      {status === "processing" && (
        <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
      )}
      {status === "completed" && (
        <CheckCircle2 className="h-3 w-3 text-green-500" />
      )}
      {status === "error" && <AlertCircle className="h-3 w-3 text-red-500" />}
      <span className="text-xs font-medium">{label}</span>
    </div>
    <Badge
      variant={
        status === "completed"
          ? "default"
          : status === "error"
          ? "destructive"
          : status === "processing"
          ? "secondary"
          : "outline"
      }
      className="text-xs"
    >
      {data
        ? `${status} (${
            typeof data === "string"
              ? "✓"
              : typeof data === "object"
              ? Object.keys(data).length
              : "✓"
          })`
        : status}
    </Badge>
  </div>
);

const DiffView = ({
  original,
  modified,
}: {
  original: string;
  modified: string;
}) => {
  const diff = dmp.diff_main(original, modified);
  dmp.diff_cleanupSemantic(diff);

  return (
    <div className="font-mono text-sm whitespace-pre-wrap break-words">
      {diff.map((part: Diff, index: number) => {
        const [type, text] = part;
        const className = cn({
          "bg-green-100 text-green-800 px-1 rounded": type === 1,
          "bg-red-100 text-red-800 px-1 rounded line-through": type === -1,
          "text-gray-700": type === 0,
        });

        return (
          <span key={index} className={className}>
            {text}
          </span>
        );
      })}
    </div>
  );
};

export const ChunkVisualizer = ({ chunks }: ChunkVisualizerProps) => {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(
    {}
  );

  const toggleStep = (chunkId: number, step: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [`${chunkId}-${step}`]: !prev[`${chunkId}-${step}`],
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {chunks.map((chunk) => (
        <Card
          key={chunk.id}
          className={cn({
            "border-green-200 bg-green-50/50": chunk.status === "completed",
            "border-blue-200 bg-blue-50/50": chunk.status === "processing",
            "border-red-200 bg-red-50/50": chunk.status === "error",
          })}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">
                Chunk {chunk.id + 1}
              </CardTitle>
              <Badge
                variant={
                  chunk.status === "completed"
                    ? "default"
                    : chunk.status === "error"
                    ? "destructive"
                    : "secondary"
                }
              >
                {chunk.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Step Progress Indicators */}
              <div className="space-y-2 bg-gray-50 rounded-md p-2">
                <StepProgress
                  label="Transcript Refinement"
                  status={chunk.response ? "completed" : chunk.status}
                  data={chunk.response}
                />
                <StepProgress
                  label="Content Analysis"
                  status={
                    chunk.analysis
                      ? "completed"
                      : chunk.status === "completed"
                      ? "processing"
                      : "pending"
                  }
                  data={chunk.analysis}
                />
                <StepProgress
                  label="Entity Extraction"
                  status={
                    chunk.entities
                      ? "completed"
                      : chunk.status === "completed"
                      ? "processing"
                      : "pending"
                  }
                  data={chunk.entities}
                />
                <StepProgress
                  label="Timeline Creation"
                  status={
                    chunk.timeline
                      ? "completed"
                      : chunk.status === "completed"
                      ? "processing"
                      : "pending"
                  }
                  data={chunk.timeline}
                />
              </div>

              <Separator />

              {/* Step Results */}
              <div className="space-y-4">
                {/* Transcript Result */}
                <Collapsible
                  open={expandedSteps[`${chunk.id}-transcript`]}
                  onOpenChange={() => toggleStep(chunk.id, "transcript")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h4 className="text-sm font-medium">Transcript Result</h4>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedSteps[`${chunk.id}-transcript`] && "rotate-90"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <Card className="p-3">
                      {chunk.status === "processing" ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        </div>
                      ) : chunk.status === "completed" && chunk.response ? (
                        <DiffView
                          original={chunk.text}
                          modified={chunk.response}
                        />
                      ) : chunk.status === "error" && chunk.error ? (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          Error: {chunk.error}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">
                          Pending processing...
                        </div>
                      )}
                    </Card>
                  </CollapsibleContent>
                </Collapsible>

                {/* Analysis Result */}
                <Collapsible
                  open={expandedSteps[`${chunk.id}-analysis`]}
                  onOpenChange={() => toggleStep(chunk.id, "analysis")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h4 className="text-sm font-medium">Analysis Result</h4>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedSteps[`${chunk.id}-analysis`] && "rotate-90"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    {chunk.analysis ? (
                      <AnalysisSummary data={chunk.analysis} />
                    ) : (
                      <div className="text-sm text-gray-400 italic p-2">
                        No analysis data available
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                {/* Entity Result */}
                <Collapsible
                  open={expandedSteps[`${chunk.id}-entities`]}
                  onOpenChange={() => toggleStep(chunk.id, "entities")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h4 className="text-sm font-medium">Entities Found</h4>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedSteps[`${chunk.id}-entities`] && "rotate-90"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    {chunk.entities ? (
                      <EntityList data={chunk.entities} />
                    ) : (
                      <div className="text-sm text-gray-400 italic p-2">
                        No entities found
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                {/* Timeline Result */}
                <Collapsible
                  open={expandedSteps[`${chunk.id}-timeline`]}
                  onOpenChange={() => toggleStep(chunk.id, "timeline")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h4 className="text-sm font-medium">Timeline Events</h4>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedSteps[`${chunk.id}-timeline`] && "rotate-90"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    {chunk.timeline && chunk.timeline.length > 0 ? (
                      <TimelineList timeline={chunk.timeline} />
                    ) : (
                      <div className="text-sm text-gray-400 italic p-2">
                        No timeline events found
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
