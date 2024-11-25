import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { ContainerBlock } from "./container-block";
import type { BusinessMetric } from "@/app/types/podcast/metrics";

interface MetricBlockProps {
  title: string;
  value: string | number;
  trend?: BusinessMetric["trend"];
  description?: string;
  className?: string;
  icon?: string;
}

export function MetricBlock({
  title,
  value,
  trend,
  description,
  className,
  icon,
}: MetricBlockProps) {
  const getTrendIcon = (direction: "up" | "down" | "flat") => {
    switch (direction) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowRight className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <ContainerBlock
      title={title}
      description={description}
      className={className}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <div className="text-2xl font-bold">{value}</div>
        </div>
        {trend && (
          <div className="flex items-center gap-2">
            {getTrendIcon(trend.direction)}
            {trend.percentage && (
              <Badge
                variant={trend.direction === "up" ? "default" : "destructive"}
              >
                {trend.percentage}%
              </Badge>
            )}
            {trend.timeframe && (
              <span className="text-sm text-muted-foreground">
                over {trend.timeframe}
              </span>
            )}
          </div>
        )}
      </div>
    </ContainerBlock>
  );
}
