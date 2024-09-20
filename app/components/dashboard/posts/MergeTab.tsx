import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BUTTON_TEXTS, MESSAGES } from "@/app/constants/editorConfig";
import dynamic from "next/dynamic";
import { TemplateCardGrid } from "./TemplateCardGrid";
import { TweetPreview } from "./TweetPreview";
import { useCreatePost } from "@/app/hooks/useCreatePost";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
});

export const MergeTab: React.FC = () => {
  const {
    post,
    updatePost,
    isMerging,
    handleMerge,
    handleSave,
    selectedContentIndex,
    setSelectedContentIndex,
  } = useCreatePost();

  const [editorContent, setEditorContent] = useState("");

  const mergedContents = useMemo(
    () => post?.mergedContents || {},
    [post?.mergedContents]
  );
  const templates = useMemo(() => post?.templates || [], [post?.templates]);

  const handleEditorUpdate = (newContent: string) => {
    if (post && templates.length > 0 && selectedContentIndex !== null) {
      const selectedTemplate = templates[selectedContentIndex];
      if (selectedTemplate && selectedTemplate.id) {
        const updatedMergedContents = { ...mergedContents };
        updatedMergedContents[selectedTemplate.id] = newContent;
        updatePost({
          ...post,
          mergedContents: updatedMergedContents,
        });
        console.log("Updated mergedContents:", updatedMergedContents);
      } else {
        console.error("Selected template or template ID is undefined");
      }
    } else {
      console.error("Unable to update merged content: missing required data");
    }
    setEditorContent(newContent);
  };

  useEffect(() => {
    if (selectedContentIndex === null && templates.length > 0) {
      setSelectedContentIndex(0);
    }
  }, [templates, selectedContentIndex, setSelectedContentIndex]);

  useEffect(() => {
    if (selectedContentIndex !== null && templates[selectedContentIndex]) {
      const templateId = templates[selectedContentIndex].id;
      if (templateId) {
        const content = mergedContents[templateId] || "";
        setEditorContent(content);
      } else {
        console.error("Selected template ID is undefined");
      }
    }
  }, [selectedContentIndex, templates, mergedContents]);

  const placeholderMessage =
    Object.keys(mergedContents).length === 0
      ? "No merged content available. Click 'Merge Content' to generate merged content."
      : "Select a template to view its merged content.";

  const contentToMerge = post?.content || "";

  const handleTemplateClick = (index: number) => {
    setSelectedContentIndex(index);
  };

  return (
    <div className="space-y-4">
      {templates.length > 0 && (
        <TemplateCardGrid
          templates={templates}
          maxTemplates={templates.length}
          onCardClick={handleTemplateClick}
          selectedIndexes={
            selectedContentIndex !== null ? [selectedContentIndex] : []
          }
        />
      )}

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-1/2">
          <TipTapEditor
            content={editorContent}
            onUpdate={(newContent) => handleEditorUpdate(newContent)}
            placeholder={placeholderMessage}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <TweetPreview content={editorContent} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {isMerging ? (
          <div className="flex items-center justify-center p-2 bg-muted rounded-md">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>{MESSAGES.MERGING_CONTENT}</span>
          </div>
        ) : (
          <Button
            onClick={handleMerge}
            disabled={!contentToMerge || templates.length === 0}
            variant="outline"
          >
            {BUTTON_TEXTS.MERGE_CONTENT}
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={Object.keys(mergedContents).length === 0}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          {BUTTON_TEXTS.SAVE}
        </Button>
      </div>
    </div>
  );
};
