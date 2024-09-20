import React from "react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import { Button } from "@/components/ui/button";
import { TemplateCardGrid } from "./TemplateCardGrid";
import { useCreatePost } from "@/app/hooks/useCreatePost";

export const TemplateTab: React.FC = () => {
  const {
    post,
    updatePost,
    handleSuggestTagsAndTemplates,
    isLoading,
    setIsTemplateModalOpen,
  } = useCreatePost();

  const selectedTemplates = post?.templates || [];

  const handleRemoveTemplate = (index: number) => {
    if (post) {
      const updatedTemplates = [...post.templates];
      updatedTemplates.splice(index, 1);
      updatePost({ templates: updatedTemplates });
    }
  };

  const openTemplateModal = (index: number) => {
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
        <Button onClick={handleSuggestTagsAndTemplates} disabled={isLoading}>
          {isLoading ? "Shortlisting..." : BUTTON_TEXTS.SHORTLIST_TEMPLATES}
        </Button>
      </div>
    </div>
  );
};
