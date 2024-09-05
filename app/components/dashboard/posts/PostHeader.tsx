import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BUTTON_TEXTS, PLACEHOLDERS } from "@/app/constants/editorConfig";

interface PostHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  handleSuggestTags: () => void;
  handleShortlistTemplates: () => void;
  handleSuggestTemplate: () => void;
  handleClear: () => void;
  handlePostToLinkedIn: () => void;
  setIsTranscriptModalOpen: (isOpen: boolean) => void;
  setIsPackModalOpen: (isOpen: boolean) => void;
  setIsTemplateModalOpen: (isOpen: boolean) => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  setTitle,
  handleSuggestTags,
  handleShortlistTemplates,
  handleSuggestTemplate,
  handleClear,
  handlePostToLinkedIn,
  setIsTranscriptModalOpen,
  setIsPackModalOpen,
  setIsTemplateModalOpen,
}) => {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder={PLACEHOLDERS.TITLE_INPUT}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setIsTranscriptModalOpen(true)}>
          {BUTTON_TEXTS.IMPORT_TRANSCRIPT}
        </Button>
        <Button onClick={() => setIsPackModalOpen(true)}>
          {BUTTON_TEXTS.SELECT_PACK}
        </Button>
        <Button onClick={() => setIsTemplateModalOpen(true)}>
          {BUTTON_TEXTS.SELECT_TEMPLATE}
        </Button>
        <Button onClick={handleSuggestTags}>{BUTTON_TEXTS.SUGGEST_TAGS}</Button>
        <Button onClick={handleShortlistTemplates}>
          {BUTTON_TEXTS.SHORTLIST_TEMPLATES}
        </Button>
        <Button onClick={handleSuggestTemplate}>
          {BUTTON_TEXTS.SUGGEST_TEMPLATE}
        </Button>
        <Button onClick={handleClear}>{BUTTON_TEXTS.CLEAR}</Button>
        <Button onClick={handlePostToLinkedIn}>
          {BUTTON_TEXTS.POST_TO_LINKEDIN}
        </Button>
      </div>
    </div>
  );
};
