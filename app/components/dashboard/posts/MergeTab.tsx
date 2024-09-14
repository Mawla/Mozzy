import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { BUTTON_TEXTS, MESSAGES } from "@/app/constants/editorConfig";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
});

interface MergeTabProps {
  mergedContents: string[];
  currentContentIndex: number;
  handlePreviousContent: () => void;
  handleNextContent: () => void;
  handleEditorUpdate: (newContent: string, index?: number) => void;
  isMerging: boolean;
  handleMerge: () => void;
  handleSave: () => void;
  transcript: string;
  selectedTemplates: any[];
}

export const MergeTab: React.FC<MergeTabProps> = ({
  mergedContents,
  currentContentIndex,
  handlePreviousContent,
  handleNextContent,
  handleEditorUpdate,
  isMerging,
  handleMerge,
  handleSave,
  transcript,
  selectedTemplates,
}) => {
  return (
    <div className="space-y-4">
      {mergedContents && mergedContents.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={handlePreviousContent}
              disabled={currentContentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span>
              Content {currentContentIndex + 1} of {mergedContents.length}
            </span>
            <Button
              onClick={handleNextContent}
              disabled={currentContentIndex === mergedContents.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <TipTapEditor
            content={mergedContents[currentContentIndex] || ""}
            onUpdate={(newContent) =>
              handleEditorUpdate(newContent, currentContentIndex)
            }
            placeholder="Merged content will appear here..."
          />
        </div>
      ) : (
        <p>No merged content available</p>
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
            disabled={
              !transcript ||
              !selectedTemplates ||
              selectedTemplates.length === 0
            }
            variant="outline"
          >
            {BUTTON_TEXTS.MERGE_CONTENT}
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={!mergedContents || mergedContents.length === 0}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          {BUTTON_TEXTS.SAVE}
        </Button>
      </div>
    </div>
  );
};
