import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BUTTON_TEXTS, MESSAGES } from "@/app/constants/editorConfig";
import { Template } from "@/utils/templateParser";
import dynamic from "next/dynamic";
import { TemplateCardGrid } from "./TemplateCardGrid";

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
}

export const MergeTab: React.FC<MergeTabProps> = ({
  mergedContents,
  handleEditorUpdate,
  isMerging,
  handleMerge,
  handleSave,
  transcript,
  selectedTemplates,
}) => {
  const [selectedContentIndex, setSelectedContentIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    // Set the first template as selected when mergedContents are available
    if (mergedContents.length > 0 && selectedContentIndex === null) {
      setSelectedContentIndex(0);
    }
  }, [mergedContents, selectedContentIndex]);

  return (
    <div className="space-y-4">
      <TemplateCardGrid
        templates={selectedTemplates}
        maxTemplates={selectedTemplates.length}
        onCardClick={setSelectedContentIndex}
        selectedIndex={selectedContentIndex}
      />

      {selectedContentIndex !== null && mergedContents[selectedContentIndex] ? (
        <TipTapEditor
          content={mergedContents[selectedContentIndex]}
          onUpdate={(newContent) =>
            handleEditorUpdate(newContent, selectedContentIndex)
          }
          placeholder="Merged content will appear here..."
        />
      ) : (
        <div className="text-center p-4 bg-gray-100 rounded-md">
          {mergedContents.length === 0
            ? "No merged content available. Click 'Merge Content' to generate merged content."
            : "Select a template to view its merged content."}
        </div>
      )}

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
