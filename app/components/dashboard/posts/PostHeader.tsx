import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import the Input component
import { usePostStore } from "@/app/stores/postStore";

// Define PLACEHOLDERS if it's not imported from elsewhere
const PLACEHOLDERS = {
  TITLE_INPUT: "Enter post title",
};

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
  const { updatePost } = usePostStore();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updatePost({ title: newTitle });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder={PLACEHOLDERS.TITLE_INPUT}
          value={title}
          onChange={handleTitleChange}
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
