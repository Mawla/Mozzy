export interface MarketInsight {
  segment: string;
  size: string;
  opportunity: string;
  challenges: string[];
  competitors: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
  }>;
}
