import React from "react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import { Button } from "@/components/ui/button";
import { TemplateCardGrid } from "./TemplateCardGrid";
import { useCreatePost } from "@/app/hooks/useCreatePost";

export const TemplateTab: React.FC = () => {
  const {
    post,
    handleSuggestTagsAndTemplates,
    handleShortlistTemplates,
    handleRemoveTemplate,
    handleTemplateSelection,
    isLoading,
    setIsTemplateModalOpen,
  } = useCreatePost();

  const selectedTemplates = post?.templates || [];

  const openTemplateModal = () => {
    setIsTemplateModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <TemplateCardGrid
        templates={selectedTemplates}
        maxTemplates={8}
        onCardClick={openTemplateModal}
        onRemove={handleRemoveTemplate}
      />

      <div className="flex justify-between items-center">
        <Button onClick={handleSuggestTagsAndTemplates} disabled={isLoading}>
          {isLoading ? "Suggesting..." : BUTTON_TEXTS.SUGGEST_TEMPLATE}
        </Button>
        <Button onClick={handleShortlistTemplates} disabled={isLoading}>
          {isLoading ? "Shortlisting..." : BUTTON_TEXTS.SHORTLIST_TEMPLATES}
        </Button>
      </div>
    </div>
  );
};
