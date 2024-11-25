export interface BusinessMetric {
  type: string;
  value: string | number;
  trend?: {
    direction: "up" | "down" | "flat";
    percentage?: number;
    timeframe?: string;
  };
  context?: string;
}
