import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        placeholder="Enter post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setIsTranscriptModalOpen(true)}>
          Import Transcript
        </Button>
        <Button onClick={() => setIsPackModalOpen(true)}>Select Pack</Button>
        <Button onClick={() => setIsTemplateModalOpen(true)}>
          Select Template
        </Button>
        <Button onClick={handleSuggestTags}>Suggest Tags</Button>
        <Button onClick={handleShortlistTemplates}>Shortlist Templates</Button>
        <Button onClick={handleSuggestTemplate}>Suggest Template</Button>
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={handlePostToLinkedIn}>Post to LinkedIn</Button>
      </div>
    </div>
  );
};
