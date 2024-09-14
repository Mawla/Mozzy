import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import YouTubeBadge from "@/app/components/YouTubeBadge";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
});

interface ContentTabProps {
  transcript: string;
  handleEditorUpdate: (newContent: string) => void;
  handleSuggestTags: () => void;
  tags: string[];
  removeTag: (tag: string) => void;
  wordCount: number; // Add this line
}

export const ContentTab: React.FC<ContentTabProps> = ({
  transcript,
  handleEditorUpdate,
  handleSuggestTags,
  tags,
  removeTag,
  wordCount, // Add this line
}) => {
  return (
    <div className="space-y-4">
      <TipTapEditor
        content={transcript}
        onUpdate={(newContent) => handleEditorUpdate(newContent)}
        placeholder="Start typing or paste your transcript here..."
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button onClick={handleSuggestTags}>
            {BUTTON_TEXTS.SUGGEST_TAGS}
          </Button>
          <span className="text-sm text-gray-500">Words: {wordCount}</span>{" "}
          {/* Add this line */}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center group"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
