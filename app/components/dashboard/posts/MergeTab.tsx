import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BUTTON_TEXTS, MESSAGES } from "@/app/constants/editorConfig";
import dynamic from "next/dynamic";
import { TemplateCardGrid } from "./TemplateCardGrid";
import { TweetPreview } from "./TweetPreview";
import { Template } from "@/app/types/template";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
});

interface MergeTabProps {
  mergedContents: string[];
  handleEditorUpdate: (newContent: string, index?: number) => void;
  isMerging: boolean;
  handleMerge: () => void;
  handleSave: () => void;
  transcript: string;
  selectedTemplates: Template[];
  selectedContentIndex: number | null;
  setSelectedContentIndex: (index: number | null) => void;
}

export const MergeTab: React.FC<MergeTabProps> = ({
  mergedContents,
  handleEditorUpdate,
  isMerging,
  handleMerge,
  handleSave,
  transcript,
  selectedTemplates,
  selectedContentIndex,
  setSelectedContentIndex,
}) => {
  const editorContent =
    selectedContentIndex !== null
      ? mergedContents[selectedContentIndex] || ""
      : "";
  const placeholderMessage =
    mergedContents.length === 0
      ? "No merged content available. Click 'Merge Content' to generate merged content."
      : "Select a template to view its merged content.";

  return (
    <div className="space-y-4">
      <TemplateCardGrid
        templates={selectedTemplates}
        maxTemplates={selectedTemplates.length}
        onCardClick={(index) => setSelectedContentIndex(index)}
        selectedIndexes={
          selectedContentIndex !== null ? [selectedContentIndex] : []
        }
      />

      <div className="flex space-x-4">
        <div className="w-1/2">
          <TipTapEditor
            content={editorContent}
            onUpdate={(newContent) =>
              handleEditorUpdate(newContent, selectedContentIndex || undefined)
            }
            placeholder={placeholderMessage}
          />
        </div>
        <div className="w-1/2">
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
            disabled={!transcript || selectedTemplates.length === 0}
            variant="outline"
          >
            {BUTTON_TEXTS.MERGE_CONTENT}
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={mergedContents.length === 0}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          {BUTTON_TEXTS.SAVE}
        </Button>
      </div>
    </div>
  );
};
