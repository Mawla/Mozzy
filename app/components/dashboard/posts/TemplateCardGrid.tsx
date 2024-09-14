import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { Template } from "@/utils/templateParser";
import { Button } from "@/components/ui/button";

interface TemplateCardGridProps {
  templates: Template[];
  maxTemplates: number;
  onCardClick: (index: number) => void;
  onRemove?: (index: number) => void;
  selectedIndex?: number;
}

export const TemplateCardGrid: React.FC<TemplateCardGridProps> = ({
  templates,
  maxTemplates,
  onCardClick,
  onRemove,
  selectedIndex,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {[...Array(maxTemplates)].map((_, index) => {
        const template = templates[index];
        return (
          <Card
            key={template ? template.id : `empty-${index}`}
            className={`flex flex-col ${
              template ? "" : "opacity-50"
            } cursor-pointer relative group ${
              selectedIndex === index ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onCardClick(index)}
          >
            {template && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <CardContent className="flex-grow p-4">
              {template ? (
                <>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{template.emoji}</span>
                    <h3 className="font-semibold">
                      {template.title || template.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {template.description}
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Plus className="w-8 h-8 mb-2" />
                  <p className="text-sm text-center">Select Template</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
