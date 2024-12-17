import * as React from "react";
import { BaseView } from "./base-block";
import { ViewSection } from "@/app/types/metadata";

interface Metric {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

interface MetricsBlockProps {
  metrics: Metric[];
}

export function MetricsBlock({ metrics }: MetricsBlockProps) {
  const sections: ViewSection[] = [
    {
      title: "Key Metrics",
      fields: metrics.map((metric) => ({
        type: "grid",
        label: metric.label,
        value: [
          {
            icon: metric.icon,
            value: metric.value,
          },
        ],
        metadata: {
          layout: "metric",
          iconPosition: "left",
        },
      })),
    },
  ];

  return <BaseView sections={sections} />;
}
