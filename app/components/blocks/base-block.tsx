import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TimelineBlock } from "./timeline-block";
import { logger } from "@/app/services/logger";
import { ErrorBoundaryWrapper } from "./error-boundary-wrapper";
import {
  ViewField,
  ViewSection,
  BlockMetadata,
  ViewFieldType,
  CustomComponentProps,
} from "@/app/types/metadata";
import { TopicBlock } from "./topic-block";

interface BaseViewProps {
  sections: ViewSection[];
  metadata?: BlockMetadata;
}

function BaseViewComponent({ sections, metadata }: BaseViewProps) {
  const renderField = React.useCallback((field: ViewField) => {
    try {
      const fieldMetadata = field.metadata || {};
      const fieldClasses = cn(
        "text-sm",
        fieldMetadata.variant === "compact" && "text-xs",
        fieldMetadata.variant === "expanded" && "text-base",
        fieldMetadata.interactive &&
          "cursor-pointer hover:bg-accent/50 rounded p-1 transition-colors"
      );

      switch (field.type) {
        case "badge":
          return (
            <Badge variant={field.variant as any} className={fieldClasses}>
              {field.value}
            </Badge>
          );
        case "list":
          const listClasses = cn(
            "space-y-2",
            fieldMetadata.renderAs === "grid" &&
              "grid grid-cols-2 gap-4 space-y-0",
            fieldMetadata.gap && `gap-${fieldMetadata.gap}`
          );

          const items = fieldMetadata.maxItems
            ? field.value.slice(0, fieldMetadata.maxItems)
            : field.value;

          return (
            <div className={listClasses}>
              {items.map((item: string, i: number) => (
                <div key={i} className={fieldClasses}>
                  {item}
                </div>
              ))}
              {fieldMetadata.showMore &&
                field.value.length > (fieldMetadata.maxItems || 0) && (
                  <div className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                    Show {field.value.length - (fieldMetadata.maxItems || 0)}{" "}
                    more...
                  </div>
                )}
            </div>
          );
        case "grid":
          const gridClasses = cn(
            "grid gap-4",
            fieldMetadata.columns
              ? `grid-cols-${fieldMetadata.columns}`
              : "grid-cols-2",
            fieldMetadata.gap && `gap-${fieldMetadata.gap}`
          );

          return (
            <div className={gridClasses}>
              {field.value.map((item: any, i: number) => (
                <div key={i} className="space-y-2">
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key} className={fieldClasses}>
                      <span className="font-medium">{key}: </span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        case "comparison":
          const comparisonMetadata = fieldMetadata.comparison || {};
          return (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">
                  {comparisonMetadata.leftLabel}
                </h4>
                {renderField({
                  ...field,
                  value: field.value.left,
                  type: comparisonMetadata.subType || "text",
                })}
              </div>
              <div>
                <h4 className="font-medium mb-2">
                  {comparisonMetadata.rightLabel}
                </h4>
                {renderField({
                  ...field,
                  value: field.value.right,
                  type: comparisonMetadata.subType || "text",
                })}
              </div>
            </div>
          );
        case "timeline":
          const timelineMetadata = fieldMetadata.timeline || {};
          return (
            <TimelineBlock
              title={field.label}
              events={field.value}
              description={timelineMetadata.description}
            />
          );
        case "custom":
          if (fieldMetadata.component === "TopicBlock") {
            const props =
              fieldMetadata.props as CustomComponentProps["TopicBlock"];
            return <TopicBlock {...props} noCard={props.noCard} />;
          }
          return null;
        default:
          return <p className={fieldClasses}>{field.value}</p>;
      }
    } catch (error) {
      logger.error(`Error rendering field ${field.type}`, error as Error);
      return null;
    }
  }, []);

  const renderSectionContent = React.useCallback(
    (section: ViewSection) => {
      try {
        const sectionMetadata = section.metadata || {};
        const contentClasses = cn(
          "space-y-4",
          sectionMetadata.spacing === "sm" && "space-y-2",
          sectionMetadata.spacing === "lg" && "space-y-6",
          sectionMetadata.padding === "sm" && "p-2",
          sectionMetadata.padding === "md" && "p-4",
          sectionMetadata.padding === "lg" && "p-6"
        );

        return (
          <div className={contentClasses}>
            {section.fields.map((field, j) => (
              <div key={j} className="space-y-2">
                <h4 className="font-medium">{field.label}</h4>
                {renderField(field)}
              </div>
            ))}
          </div>
        );
      } catch (error) {
        logger.error("Error rendering section content", error as Error);
        return null;
      }
    },
    [renderField]
  );

  const blockClasses = cn(
    "space-y-4",
    metadata?.spacing === "sm" && "space-y-2",
    metadata?.spacing === "lg" && "space-y-6"
  );

  return (
    <div className={blockClasses}>
      {sections.map((section, i) => {
        try {
          const sectionMetadata = section.metadata || {};

          // Check if the section contains only a timeline field
          const isTimelineSection =
            section.fields.length === 1 &&
            section.fields[0].type === "timeline";

          // If it's a timeline section, render it directly without the Card wrapper
          if (isTimelineSection) {
            return renderField(section.fields[0]);
          }

          // If noCard is true, render without Card wrapper
          if (sectionMetadata.noCard) {
            return <div key={i}>{renderSectionContent(section)}</div>;
          }

          // Build card classes based on metadata
          const cardClasses = cn(
            sectionMetadata.variant === "bordered" && "border-2",
            sectionMetadata.variant === "plain" &&
              "border-0 shadow-none bg-transparent",
            !sectionMetadata.rounded && "rounded-none",
            !sectionMetadata.shadow && "shadow-none",
            !sectionMetadata.background && "bg-transparent"
          );

          // Build title classes based on metadata
          const titleClasses = cn(
            sectionMetadata.titleSize === "sm" && "text-sm",
            sectionMetadata.titleSize === "lg" && "text-lg",
            sectionMetadata.titleSize === "xl" && "text-xl"
          );

          // Otherwise, render the normal Card layout
          return (
            <Card key={i} className={cardClasses}>
              {sectionMetadata.showTitle !== false && (
                <CardHeader>
                  <CardTitle className={titleClasses}>
                    {section.title}
                  </CardTitle>
                  {section.description &&
                    sectionMetadata.showDescription !== false && (
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                </CardHeader>
              )}
              <CardContent>{renderSectionContent(section)}</CardContent>
            </Card>
          );
        } catch (error) {
          logger.error(`Error rendering section ${i}`, error as Error);
          return null;
        }
      })}
    </div>
  );
}

// Wrap with error boundary wrapper
export const BaseView = ({ sections, metadata }: BaseViewProps) => (
  <ErrorBoundaryWrapper name="BaseView">
    <BaseViewComponent sections={sections} metadata={metadata} />
  </ErrorBoundaryWrapper>
);
