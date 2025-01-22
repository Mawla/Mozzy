"use client";
/** @jsxImportSource react */

import { useEffect, useState } from "react";
import {
  ProcessingChunk,
  ProcessingState,
  ProcessingStep,
  ProcessingStatus,
} from "@/app/types/processing";
import type { TimelineEvent } from "@/app/types/shared/timeline";
import { NetworkLogger } from "@/app/components/dashboard/podcasts/NetworkLogger";
import { ChunkVisualizer } from "@/app/components/dashboard/podcasts/ChunkVisualizer";
import { ProcessingStatus as ProcessingStatusComponent } from "./ProcessingStatus";
import { createValidatedPodcastEntity } from "@/app/utils/type-conversion/entity";
import type { ValidatedPodcastEntities } from "@/app/types/entities/podcast";

interface ProcessingPipelineViewProps {
  state: ProcessingState;
  onRetry?: (stepId: string) => void;
}

export function ProcessingPipelineView({
  state,
  onRetry,
}: ProcessingPipelineViewProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleStep = (stepId: string) => {
    setExpanded((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Processing Progress</h3>
          <span className="text-sm font-medium">
            {Math.round(state.overallProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${state.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {state.steps.map((step: ProcessingStep) => (
          <div
            key={step.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <button
              onClick={() => toggleStep(step.id)}
              className="w-full flex justify-between items-center"
            >
              <div className="flex items-center space-x-3">
                <ProcessingStatusComponent
                  status={step.status}
                  className="text-lg"
                />
                <span className="font-medium">{step.name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {step.progress !== undefined ? `${step.progress}%` : ""}
              </span>
            </button>

            {/* Expanded Content */}
            {expanded.includes(step.id) && (
              <div className="mt-4 pl-8">
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                {step.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-2">
                    <p className="text-sm text-red-700">
                      {typeof step.error === "string"
                        ? step.error
                        : step.error instanceof Error
                        ? step.error.message
                        : "Unknown error"}
                    </p>
                    {onRetry && (
                      <button
                        onClick={() => onRetry(step.id)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Retry Step
                      </button>
                    )}
                  </div>
                )}
                {step.chunks && (
                  <ChunkVisualizer
                    chunks={step.chunks.map((chunk: ProcessingChunk) => {
                      const result = chunk.result
                        ? {
                            id: chunk.result.id,
                            text: chunk.result.text,
                            refinedText:
                              chunk.result.refinedText || chunk.result.text,
                            analysis: chunk.result.analysis
                              ? {
                                  ...chunk.result.analysis,
                                  entities: chunk.result.analysis.entities
                                    ? {
                                        people:
                                          chunk.result.analysis.entities.people.map(
                                            (p) => ({
                                              ...p,
                                              type: "PERSON" as const,
                                              role: "speaker",
                                              expertise: p.expertise || [
                                                "unknown",
                                              ],
                                              context: p.context || "",
                                              mentions: p.mentions || [],
                                              createdAt:
                                                p.createdAt ||
                                                new Date().toISOString(),
                                              updatedAt:
                                                p.updatedAt ||
                                                new Date().toISOString(),
                                            })
                                          ),
                                        organizations:
                                          chunk.result.analysis.entities.organizations.map(
                                            (o) => ({
                                              ...o,
                                              type: "ORGANIZATION" as const,
                                              industry: o.industry || "unknown",
                                              size: "unknown",
                                              context: o.context || "",
                                              mentions: o.mentions || [],
                                              createdAt:
                                                o.createdAt ||
                                                new Date().toISOString(),
                                              updatedAt:
                                                o.updatedAt ||
                                                new Date().toISOString(),
                                            })
                                          ),
                                        locations:
                                          chunk.result.analysis.entities.locations.map(
                                            (l) => ({
                                              ...l,
                                              type: "LOCATION" as const,
                                              locationType: "unknown",
                                              context: l.context || "",
                                              mentions: l.mentions || [],
                                              createdAt:
                                                l.createdAt ||
                                                new Date().toISOString(),
                                              updatedAt:
                                                l.updatedAt ||
                                                new Date().toISOString(),
                                            })
                                          ),
                                        events:
                                          chunk.result.analysis.entities.events.map(
                                            (e) => ({
                                              ...e,
                                              type: "EVENT" as const,
                                              date: new Date().toISOString(),
                                              duration: "unknown",
                                              participants: ["unknown"],
                                              context: e.context || "",
                                              mentions: e.mentions || [],
                                              createdAt:
                                                e.createdAt ||
                                                new Date().toISOString(),
                                              updatedAt:
                                                e.updatedAt ||
                                                new Date().toISOString(),
                                            })
                                          ),
                                      }
                                    : undefined,
                                }
                              : undefined,
                            entities: chunk.result.entities
                              ? ({
                                  people: chunk.result.entities.people.map(
                                    (p) => ({
                                      ...p,
                                      type: "PERSON" as const,
                                      role: "speaker",
                                      expertise: p.expertise || ["unknown"],
                                      context: p.context || "",
                                      mentions: p.mentions || [],
                                      createdAt:
                                        p.createdAt || new Date().toISOString(),
                                      updatedAt:
                                        p.updatedAt || new Date().toISOString(),
                                    })
                                  ),
                                  organizations:
                                    chunk.result.entities.organizations.map(
                                      (o) => ({
                                        ...o,
                                        type: "ORGANIZATION" as const,
                                        industry: o.industry || "unknown",
                                        size: "unknown",
                                        context: o.context || "",
                                        mentions: o.mentions || [],
                                        createdAt:
                                          o.createdAt ||
                                          new Date().toISOString(),
                                        updatedAt:
                                          o.updatedAt ||
                                          new Date().toISOString(),
                                      })
                                    ),
                                  locations:
                                    chunk.result.entities.locations.map(
                                      (l) => ({
                                        ...l,
                                        type: "LOCATION" as const,
                                        locationType: "unknown",
                                        context: l.context || "",
                                        mentions: l.mentions || [],
                                        createdAt:
                                          l.createdAt ||
                                          new Date().toISOString(),
                                        updatedAt:
                                          l.updatedAt ||
                                          new Date().toISOString(),
                                      })
                                    ),
                                  events: chunk.result.entities.events.map(
                                    (e) => ({
                                      ...e,
                                      type: "EVENT" as const,
                                      date: new Date().toISOString(),
                                      duration: "unknown",
                                      participants: ["unknown"],
                                      context: e.context || "",
                                      mentions: e.mentions || [],
                                      createdAt:
                                        e.createdAt || new Date().toISOString(),
                                      updatedAt:
                                        e.updatedAt || new Date().toISOString(),
                                    })
                                  ),
                                } as ValidatedPodcastEntities)
                              : {
                                  people: [],
                                  organizations: [],
                                  locations: [],
                                  events: [],
                                },
                            timeline:
                              (chunk.result as any).timeline ||
                              ([] as TimelineEvent[]),
                          }
                        : undefined;

                      return {
                        id: chunk.id,
                        text: chunk.text,
                        start: chunk.start,
                        end: chunk.end,
                        startIndex: chunk.startIndex,
                        endIndex: chunk.endIndex,
                        status: chunk.status,
                        result,
                      };
                    })}
                  />
                )}
                {step.networkLogs && <NetworkLogger logs={step.networkLogs} />}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Status */}
      <div
        className={`mt-6 p-4 rounded-lg ${
          state.status === "completed"
            ? "bg-green-50 text-green-700"
            : state.status === "failed"
            ? "bg-red-50 text-red-700"
            : state.status === "processing"
            ? "bg-blue-50 text-blue-700"
            : "bg-gray-50 text-gray-700"
        }`}
      >
        <p className="font-medium">
          <ProcessingStatusComponent status={state.status} />
        </p>
        {state.error && <p className="text-sm mt-2">Error: {state.error}</p>}
      </div>
    </div>
  );
}
