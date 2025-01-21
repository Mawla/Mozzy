import type { TopicAnalysis } from "@/app/types/processing/base";
import type { PodcastProcessingAnalysis } from "@/app/types/processing/podcast";

interface AnalysisSummaryProps {
  data?: PodcastProcessingAnalysis;
}

export const AnalysisSummary = ({ data }: AnalysisSummaryProps) => {
  if (!data) return null;

  return (
    <div className="mt-4 space-y-4">
      {data.summary && (
        <div>
          <h4 className="font-medium mb-2">Summary</h4>
          <p className="text-sm text-gray-600">{data.summary}</p>
        </div>
      )}
      {data.keyPoints && data.keyPoints.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Key Points</h4>
          <ul className="list-disc list-inside space-y-2">
            {data.keyPoints.map((point, index) => (
              <li key={index} className="text-sm text-gray-600">
                <span className="font-medium">{point.title}</span>:{" "}
                {point.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.topics && data.topics.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Topics</h4>
          <div className="space-y-2">
            {data.topics.map((topic: TopicAnalysis, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <h5 className="font-medium">{topic.name}</h5>
                <p className="text-sm text-gray-600">
                  Keywords: {topic.keywords.join(", ")}
                </p>
                <p className="text-xs text-gray-500">
                  Confidence: {(topic.confidence * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
