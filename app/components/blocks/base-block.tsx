import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TimelineView } from "./timeline-block";

export type ViewField = {
  type:
    | "text"
    | "number"
    | "badge"
    | "list"
    | "grid"
    | "comparison"
    | "timeline";
  label: string;
  value: any;
  variant?: string;
  metadata?: Record<string, any>;
};

export type ViewSection = {
  title: string;
  description?: string;
  fields: ViewField[];
};

interface BaseViewProps {
  sections: ViewSection[];
}

export function BaseView({ sections }: BaseViewProps) {
  const renderField = (field: ViewField) => {
    switch (field.type) {
      case "badge":
        return (
          <Badge variant={field.variant as any} className="text-sm">
            {field.value}
          </Badge>
        );
      case "list":
        return (
          <ul className="list-disc pl-4 space-y-2">
            {field.value.map((item: string, i: number) => (
              <li key={i} className="text-sm">
                {item}
              </li>
            ))}
          </ul>
        );
      case "grid":
        return (
          <div className="grid grid-cols-2 gap-4">
            {field.value.map((item: any, i: number) => (
              <div key={i} className="space-y-2">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}: </span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      case "comparison":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">{field.metadata?.leftLabel}</h4>
              {renderField({
                ...field,
                value: field.value.left,
                type: field.metadata?.subType,
              })}
            </div>
            <div>
              <h4 className="font-medium mb-2">{field.metadata?.rightLabel}</h4>
              {renderField({
                ...field,
                value: field.value.right,
                type: field.metadata?.subType,
              })}
            </div>
          </div>
        );
      case "timeline":
        return (
          <TimelineView
            title={field.label}
            events={field.value}
            description={field.metadata?.description}
          />
        );
      default:
        return <p className="text-sm text-muted-foreground">{field.value}</p>;
    }
  };

  return (
    <div className="space-y-4">
      {sections.map((section, i) => {
        // Check if the section contains only a timeline field
        const isTimelineSection =
          section.fields.length === 1 && section.fields[0].type === "timeline";

        // If it's a timeline section, render it directly without the Card wrapper
        if (isTimelineSection) {
          return renderField(section.fields[0]);
        }

        // Otherwise, render the normal Card layout
        return (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              {section.description && (
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.fields.map((field, j) => (
                  <div key={j} className="space-y-2">
                    <h4 className="font-medium">{field.label}</h4>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
