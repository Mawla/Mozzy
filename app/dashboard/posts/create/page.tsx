"use client";
import React, { useState } from "react";
import { useCreatePost } from "@/app/hooks/useCreatePost";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { ProgressNotes } from "@/app/components/dashboard/posts/ProgressNotes";
import { Button } from "@/components/ui/button";
import TemplateSelectionModal from "@/app/components/dashboard/posts/TemplateSelectionModal";
import ContentHubImportModal from "@/app/components/dashboard/posts/ContentHubImportModal";
import ApiErrorMessage from "@/app/components/ApiErrorMessage";
import { Trash2 } from "lucide-react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";

const CreatePostPage = () => {
  const { post, updatePost, progressNotes, apiError } = useCreatePost();

  // Manage ContentHubModal state locally
  const [isContentHubModalOpen, setIsContentHubModalOpen] = useState(false);

  const handleClear = () => {
    updatePost({ content: "", title: "" });
  };

  const handleImportTranscript = (transcript: string) => {
    updatePost({ content: transcript });
    setIsContentHubModalOpen(false); // Close the modal after import
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <PostHeader
          title={post?.title || ""}
          setTitle={(title) => updatePost({ title })}
        />
        <Button onClick={() => setIsContentHubModalOpen(true)} className="ml-4">
          Import Content
        </Button>
        <Button
          onClick={handleClear}
          className="ml-4 text-destructive"
          variant="ghost"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {BUTTON_TEXTS.CLEAR}
        </Button>
      </div>
      <PostContent post={post} updatePost={updatePost} />
      <ProgressNotes progressNotes={progressNotes} />
      <ContentHubImportModal
        isOpen={isContentHubModalOpen}
        onClose={() => setIsContentHubModalOpen(false)}
      />
      {apiError && (
        <ApiErrorMessage
          error={apiError}
          onClose={() => updatePost({ apiError: null })}
        />
      )}
    </div>
  );
};

export default CreatePostPage;
