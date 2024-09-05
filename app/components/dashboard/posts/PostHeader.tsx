import React from "react";
import { Input } from "@/components/ui/input";
import { PLACEHOLDERS } from "@/app/constants/editorConfig";

interface PostHeaderProps {
  title: string;
  setTitle: (title: string) => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ title, setTitle }) => {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder={PLACEHOLDERS.TITLE_INPUT}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
