import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import YouTubeBadge from "@/app/components/YouTubeBadge";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
});

interface ContentTabProps {
  transcript: string;
  handleEditorUpdate: (newContent: string) => void;
  handleSuggestTags: () => void;
  tags: string[];
}

export const ContentTab: React.FC<ContentTabProps> = ({
  transcript,
  handleEditorUpdate,
  handleSuggestTags,
  tags,
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <YouTubeBadge />
      </div>
      <TipTapEditor
        content={transcript || ""}
        onUpdate={(newContent) => handleEditorUpdate(newContent)}
        placeholder="Enter your transcript here..."
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {tags && tags.length > 0 ? (
          tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="py-1 px-2 rounded-full bg-gray-200 text-gray-800"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))
        ) : (
          <p>No tags available</p>
        )}
      </div>
      <Button onClick={handleSuggestTags}>{BUTTON_TEXTS.SUGGEST_TAGS}</Button>
    </div>
  );
};
