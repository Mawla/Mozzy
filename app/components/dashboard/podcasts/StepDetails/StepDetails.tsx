import { Badge } from "@/components/ui/badge";
import type {
  TimelineEvent,
  ProcessingStatus,
  NetworkLog,
} from "@/app/types/processing/base";
import type {
  PodcastProcessingStep,
  PodcastProcessingAnalysis,
} from "@/app/types/processing/podcast";
import type { ValidatedPodcastEntities } from "@/app/types/entities/podcast";
import { EntityList } from "./EntityList";
import { TimelineList } from "./TimelineList";
import { AnalysisSummary } from "./AnalysisSummary";

interface StepDetailsProps {
  step: PodcastProcessingStep;
}

// Type guard for analysis data
const isAnalysisData = (
  data: any
): data is { analysis: PodcastProcessingAnalysis } => {
  return data && typeof data === "object" && "analysis" in data;
};

// Type guard for entity data
const isEntityData = (
  data: any
): data is { entities: ValidatedPodcastEntities } => {
  return data && typeof data === "object" && "entities" in data;
};

export const StepDetails = ({ step }: StepDetailsProps) => {
  // Handle error state
  if (step.error) {
    return (
      <div className="text-red-600">
        Error:{" "}
        {step.error instanceof Error ? step.error.message : String(step.error)}
      </div>
    );
  }

  // Handle missing data
  if (!step.data) {
    return null;
  }

  switch (step.name) {
    case "Content Analysis":
      if (!isAnalysisData(step.data) || !step.data.analysis) {
        return (
          <div className="text-yellow-600">Analysis data not available</div>
        );
      }
      return <AnalysisSummary data={step.data.analysis} />;
    case "Entity Extraction": {
      if (!isEntityData(step.data) || !step.data.entities) {
        return <div className="text-yellow-600">Entity data not available</div>;
      }

      const { entities } = step.data;
      return (
        <div className="space-y-6">
          {entities.people && entities.people.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">People</h4>
              <EntityList entities={entities.people} />
            </div>
          )}
          {entities.organizations && entities.organizations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Organizations</h4>
              <EntityList entities={entities.organizations} />
            </div>
          )}
          {entities.locations && entities.locations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Locations</h4>
              <EntityList entities={entities.locations} />
            </div>
          )}
          {entities.events && entities.events.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Events</h4>
              <EntityList entities={entities.events} />
            </div>
          )}
        </div>
      );
    }
    case "Timeline Creation":
      return <TimelineList timeline={step.data.timeline} />;
    default:
      return null;
  }
};
