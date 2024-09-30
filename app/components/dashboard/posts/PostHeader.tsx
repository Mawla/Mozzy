import React from "react";
import { Input } from "@/components/ui/input";
import { PLACEHOLDERS } from "@/app/constants/editorConfig";
import { Button } from "@/components/ui/button";

interface PostHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  setTitle,
  onSave,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder={PLACEHOLDERS.TITLE_INPUT}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={onSave} variant="default">
          Save
        </Button>
        <Button
          onClick={onDelete}
          variant="ghost"
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
