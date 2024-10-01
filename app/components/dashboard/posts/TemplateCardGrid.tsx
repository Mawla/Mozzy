import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Loader2 } from "lucide-react";
import { Template } from "@/app/types/template";
import { Button } from "@/components/ui/button";

interface TemplateCardGridProps {
  templates: Template[] | null | undefined;
  maxTemplates: number;
  onCardClick: (index: number) => void;
  onRemove?: (index: number) => void;
  selectedIndexes?: number[];
  currentMergingIndex: number | null;
}

export const TemplateCardGrid: React.FC<TemplateCardGridProps> = ({
  templates,
  maxTemplates,
  onCardClick,
  onRemove,
  selectedIndexes = [],
  currentMergingIndex,
}) => {
  const safeTemplates = templates || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {safeTemplates.slice(0, maxTemplates).map((template, index) => (
        <div
          key={template ? `${template.id}-${index}` : `empty-${index}`}
          className={`relative cursor-pointer p-4 border rounded-lg ${
            selectedIndexes.includes(index)
              ? "border-blue-500"
              : "border-gray-200"
          } ${currentMergingIndex === index ? "animate-pulse" : ""}`}
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
            {currentMergingIndex === index && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </CardContent>
        </div>
      ))}
    </div>
  );
};
