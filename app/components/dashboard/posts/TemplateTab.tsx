import React, { useState } from "react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import { Button } from "@/components/ui/button";
import { TemplateCardGrid } from "./TemplateCardGrid";
import { usePost } from "@/app/providers/PostProvider";
import TemplateSelectionModal from "./TemplateSelectionModal";
import { postService } from "@/app/services/postService";

export const TemplateTab: React.FC = () => {
  const {
    post,
    handleSuggestTagsAndTemplates,
    handleShortlistTemplates,
    handleRemoveTemplate,
    handleTemplateSelection,
  } = usePost();

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [filteredPacks, setFilteredPacks] = useState(postService.getPacks());
  const [filter, setFilter] = useState<
    "all" | "recent" | "favorite" | "suggested" | "shortlisted"
  >("all");

  const selectedTemplates = post?.templates || [];

  const openTemplateModal = () => {
    setIsTemplateModalOpen(true);
  };

  const handleFilterChange = (
    newFilter: "all" | "recent" | "favorite" | "suggested" | "shortlisted"
  ) => {
    setFilter(newFilter);
    // Here you would implement the logic to filter the packs based on the selected filter
    // For now, we'll just use all packs
    setFilteredPacks(postService.getPacks());
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
        <Button onClick={handleSuggestTagsAndTemplates}>
          {BUTTON_TEXTS.SUGGEST_TEMPLATE}
        </Button>
        <Button onClick={handleShortlistTemplates}>
          {BUTTON_TEXTS.SHORTLIST_TEMPLATES}
        </Button>
      </div>

      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        filteredPacks={filteredPacks}
        onSelectTemplate={handleTemplateSelection}
        filter={filter}
        setFilter={handleFilterChange}
      />
    </div>
  );
};
