import React from "react";
import TipTapEditor from "@/app/components/TipTapEditor";
import { ActiveTabType } from "@/app/types/editor";

interface PostContentProps {
  content: string;
  handleEditorUpdate: (newContent: string) => void;
  activeTab: ActiveTabType;
  actionButtons: React.ReactNode[];
}

export const PostContent: React.FC<PostContentProps> = ({
  content,
  handleEditorUpdate,
  activeTab,
  actionButtons,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        {actionButtons.map((button, index) => (
          <React.Fragment key={index}>{button}</React.Fragment>
        ))}
      </div>
      <TipTapEditor content={content} onUpdate={handleEditorUpdate} />
    </div>
  );
};
