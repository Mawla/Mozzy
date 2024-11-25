export interface ProductInsight {
  feature: string;
  problem: string;
  solution: string;
  validation: {
    method: string;
    results: string;
  };
  iterations: Array<{
    version: string;
    changes: string[];
    feedback: string;
    outcome: string;
  }>;
}
