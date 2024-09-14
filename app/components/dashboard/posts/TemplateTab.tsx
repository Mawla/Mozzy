import React from "react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import { Template } from "@/app/types/template";
import { Button } from "@/components/ui/button";
import { TemplateCardGrid } from "./TemplateCardGrid";

interface TemplateTabProps {
  selectedTemplates: Template[];
  openTemplateModal: (index: number) => void;
  handleSuggestTemplate: () => void;
  handleShortlistTemplates: () => Promise<void>;
  handleRemoveTemplate: (index: number) => void;
}

export const TemplateTab: React.FC<TemplateTabProps> = ({
  selectedTemplates,
  openTemplateModal,
  handleSuggestTemplate,
  handleShortlistTemplates,
  handleRemoveTemplate,
}) => {
  return (
    <div className="space-y-4">
      <TemplateCardGrid
        templates={selectedTemplates}
        maxTemplates={8}
        onCardClick={openTemplateModal}
        onRemove={handleRemoveTemplate}
      />

      <div className="flex justify-between items-center">
        <Button onClick={handleSuggestTemplate}>
          {BUTTON_TEXTS.SUGGEST_TEMPLATE}
        </Button>
        <Button onClick={handleShortlistTemplates}>
          {BUTTON_TEXTS.SHORTLIST_TEMPLATES}
        </Button>
      </div>
    </div>
  );
};
