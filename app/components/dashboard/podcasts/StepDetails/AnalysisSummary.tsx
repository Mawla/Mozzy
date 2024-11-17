import { KeyPoint, Theme } from "@/app/types/podcast/processing";

interface AnalysisSummaryProps {
  data: {
    summary?: string;
    keyPoints?: KeyPoint[];
    themes?: Theme[];
  };
}

export const AnalysisSummary = ({ data }: AnalysisSummaryProps) => {
  return (
    <div className="mt-4 space-y-4">
      {data.summary && (
        <div>
          <h4 className="font-medium mb-2">Summary</h4>
          <p className="text-sm text-gray-600">{data.summary}</p>
        </div>
      )}
      {data.keyPoints && (
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
      {data.themes && (
        <div>
          <h4 className="font-medium mb-2">Themes</h4>
          <div className="space-y-2">
            {data.themes.map((theme, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <h5 className="font-medium">{theme.name}</h5>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
