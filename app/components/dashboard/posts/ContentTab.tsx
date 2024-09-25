import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import dynamic from "next/dynamic";
import { usePost } from "@/app/providers/PostProvider";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export const ContentTab: React.FC = () => {
  const { post, updatePost, handleSuggestTagsAndTemplates } = usePost();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const wordCount = useMemo(() => {
    return post?.content.trim().split(/\s+/).length || 0;
  }, [post?.content]);

  const handleEditorUpdate = (content: string) => {
    if (post) {
      updatePost({ content });
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (post && post.tags) {
      const updatedTags = post.tags.filter((tag) => tag !== tagToRemove);
      updatePost({ tags: updatedTags });
    }
  };

  return (
    <div className="space-y-4">
      {isClient && (
        <TipTapEditor
          content={post?.content || ""}
          onUpdate={handleEditorUpdate}
          placeholder="Start typing or paste your transcript here..."
        />
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button onClick={handleSuggestTagsAndTemplates}>
            {BUTTON_TEXTS.SUGGEST_TAGS}
          </Button>
          <span className="text-sm text-gray-500">Words: {wordCount}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {post?.tags?.map((tag: string) => (
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
