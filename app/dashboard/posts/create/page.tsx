"use client";
import React, { useEffect } from "react";
import { usePost } from "@/app/providers/PostProvider";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { ProgressNotes } from "@/app/components/dashboard/posts/ProgressNotes";
import { Button } from "@/components/ui/button";
import ContentHubImportModal from "@/app/components/dashboard/posts/ContentHubImportModal";
import ApiErrorMessage from "@/app/components/ApiErrorMessage";
import { PlusCircle } from "lucide-react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import { useState } from "react";

const CreatePostPage = () => {
  const { post, updatePost, createNewPost, handleSave } = usePost();
  const [isContentHubModalOpen, setIsContentHubModalOpen] = useState(false);
  const [progressNotes, setProgressNotes] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    createNewPost();
  }, [createNewPost]);

  const handleImportTranscript = (transcript: string) => {
    if (post) {
      updatePost({
        ...post,
        content: transcript,
      });
    }
    setIsContentHubModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <PostHeader
          title={post?.title || ""}
          setTitle={(title) => post && updatePost({ ...post, title })}
        />
        <Button onClick={() => setIsContentHubModalOpen(true)} className="ml-4">
          Import Content
        </Button>
      </div>
      <PostContent />
      <ProgressNotes progressNotes={progressNotes} />
      <ContentHubImportModal
        isOpen={isContentHubModalOpen}
        onClose={() => setIsContentHubModalOpen(false)}
        onImport={handleImportTranscript}
      />
      {apiError && (
        <ApiErrorMessage error={apiError} onClose={() => setApiError(null)} />
      )}
      <Button onClick={handleSave}>Save Post</Button>
    </div>
  );
};

export default CreatePostPage;
