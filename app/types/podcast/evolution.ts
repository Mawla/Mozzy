export interface CompanyMilestone {
  event: string;
  stage: string;
  significance: string;
  metrics?: {
    before: Record<string, string | number>;
    after: Record<string, string | number>;
  };
  keyLearnings: string[];
}
