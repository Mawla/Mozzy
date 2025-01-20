import { Badge } from "@/components/ui/badge";
import type {
  TimelineEvent,
  ProcessingAnalysis,
  ProcessingStep,
  ProcessingStatus,
} from "@/app/core/processing/types/base";
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
} from "@/app/types/entities";
import { EntityList } from "./EntityList";
import { TimelineList } from "./TimelineList";
import { AnalysisSummary } from "./AnalysisSummary";

interface ValidatedPodcastEntities {
  people: PersonEntity[];
  organizations: OrganizationEntity[];
  locations: LocationEntity[];
  events: EventEntity[];
}

interface StepDetailsProps {
  step: ProcessingStep & {
    data?: {
      entities?: ValidatedPodcastEntities;
      analysis?: ProcessingAnalysis;
      timeline?: TimelineEvent[];
      [key: string]: any;
    };
  };
}

export const StepDetails = ({ step }: StepDetailsProps) => {
  if (!step.data) {
    if (step.error) {
      return (
        <div className="text-red-600">
          Error: {step.error instanceof Error ? step.error.message : step.error}
        </div>
      );
    }
    return null;
  }

  switch (step.name) {
    case "Content Analysis":
      return <AnalysisSummary data={step.data.analysis} />;
    case "Entity Extraction": {
      const entities = step.data.entities;
      if (!entities) return null;

      return (
        <div className="space-y-6">
          {entities.people.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">People</h4>
              <EntityList entities={entities.people} />
            </div>
          )}
          {entities.organizations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Organizations</h4>
              <EntityList entities={entities.organizations} />
            </div>
          )}
          {entities.locations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Locations</h4>
              <EntityList entities={entities.locations} />
            </div>
          )}
          {entities.events.length > 0 && (
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
