import React, { useState, useEffect } from "react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import { Button } from "@/components/ui/button";
import { TemplateCardGrid } from "./TemplateCardGrid";
import { usePost } from "@/app/providers/PostProvider";
import TemplateSelectionModal from "./TemplateSelectionModal";
import { postService } from "@/app/services/postService";
import { Template } from "@/app/types/template";

export const TemplateTab: React.FC = () => {
  const {
    post,
    updatePost,
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log("TemplateTab mounted, post:", post);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Current post:", post);
    console.log("Current post templates:", post?.templates);
    console.log("Current post templateIds:", post?.templateIds);
  }, [post]);

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

  const handleTemplateRemove = (index: number) => {
    console.log("Removing template at index:", index);
    handleRemoveTemplate(index);
  };

  const handleTemplateSelect = (template: Template) => {
    console.log("Selected template:", template);
    handleTemplateSelection(template);
    setIsTemplateModalOpen(false);
  };

  const handleSuggestTemplates = async () => {
    console.log("Suggesting templates...");
    await handleSuggestTagsAndTemplates();
  };

  const handleShortlist = async () => {
    console.log("Shortlisting templates...");
    await handleShortlistTemplates();
  };

  return (
    <div className="space-y-4">
      {isClient && (
        <>
          <TemplateCardGrid
            templates={post?.templates || []}
            maxTemplates={8}
            onCardClick={openTemplateModal}
            onRemove={handleTemplateRemove}
          />

          <div className="flex justify-between items-center">
            <Button onClick={handleSuggestTemplates}>
              {BUTTON_TEXTS.SUGGEST_TEMPLATE}
            </Button>
            <Button onClick={handleShortlist}>
              {BUTTON_TEXTS.SHORTLIST_TEMPLATES}
            </Button>
          </div>

          <TemplateSelectionModal
            isOpen={isTemplateModalOpen}
            onClose={() => setIsTemplateModalOpen(false)}
            filteredPacks={filteredPacks}
            onSelectTemplate={handleTemplateSelect}
            filter={filter}
            setFilter={handleFilterChange}
          />
        </>
      )}
    </div>
  );
};
