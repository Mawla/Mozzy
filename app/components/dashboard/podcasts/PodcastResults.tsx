"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Podcast, ProcessedPodcast } from "@/app/types/podcast";
import { transformPodcastData } from "@/app/services/podcast/transformers";

interface PodcastResultsProps {
  podcast: Podcast;
  analysis?: ProcessedPodcast;
}

export function PodcastResults({ podcast, analysis }: PodcastResultsProps) {
  const transformedData = React.useMemo(
    () => transformPodcastData(podcast, analysis),
    [podcast, analysis]
  );
  const metrics = transformedData.metrics || [];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{metric.icon}</span>
              <span className="text-sm text-gray-600">{metric.label}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline Section */}
      {analysis?.timeline && analysis.timeline.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Timeline</h3>
          <div className="space-y-4">
            {analysis.timeline.map((point, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="min-w-[100px] text-sm text-gray-500">
                  {point.time}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{point.event}</p>
                  {point.importance && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        point.importance === "high"
                          ? "bg-red-100 text-red-800"
                          : point.importance === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {point.importance}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Points Section */}
      {analysis?.keyPoints && analysis.keyPoints.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Key Points</h3>
          <ul className="list-disc pl-5 space-y-2">
            {analysis.keyPoints.map((point, index) => (
              <li key={index} className="text-sm">
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Section */}
      {analysis?.summary && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <p className="text-sm text-gray-700">{analysis.summary}</p>
        </div>
      )}
    </div>
  );
}
