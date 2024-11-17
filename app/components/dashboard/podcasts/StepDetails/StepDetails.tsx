import { Badge } from "@/components/ui/badge";
import { TimelineEvent, KeyPoint, Theme } from "@/app/types/podcast/processing";
import { EntityList } from "../StepDetails/EntityList";
import { TimelineList } from "../StepDetails/TimelineList";
import { AnalysisSummary } from "../StepDetails/AnalysisSummary";

interface StepDetailsProps {
  step: {
    name: string;
    status: string;
    data?: any;
    error?: string;
  };
}

export const StepDetails = ({ step }: StepDetailsProps) => {
  if (!step.data) return null;

  switch (step.name) {
    case "Content Analysis":
      return <AnalysisSummary data={step.data} />;
    case "Entity Extraction":
      return <EntityList data={step.data} />;
    case "Timeline Creation":
      return <TimelineList timeline={step.data.timeline} />;
    default:
      return null;
  }
};
