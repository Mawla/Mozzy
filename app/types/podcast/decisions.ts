export interface StrategicDecision {
  title: string;
  date: string;
  context: string;
  alternatives: Array<{
    option: string;
    pros: string[];
    cons: string[];
  }>;
  outcome: {
    choice: string;
    rationale: string;
    learnings: string[];
  };
}
