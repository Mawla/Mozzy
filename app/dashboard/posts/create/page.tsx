"use client";
import React, { useEffect, useState } from "react";
import { usePostStore } from "@/app/stores/postStore";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { ProgressNotes } from "@/app/components/dashboard/posts/ProgressNotes";
import { Button } from "@/components/ui/button";
import ContentHubImportModal from "@/app/components/dashboard/posts/ContentHubImportModal";
import ApiErrorMessage from "@/app/components/ApiErrorMessage";
import { useRouter } from "next/navigation";

const CreatePostPage = () => {
  const { currentPost, updatePost, createNewPost, handleSave } = usePostStore();
  const [isContentHubModalOpen, setIsContentHubModalOpen] = useState(false);
  const [progressNotes, setProgressNotes] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    createNewPost();
  }, [createNewPost]);

  const handleImportTranscript = (transcript: string) => {
    if (currentPost) {
      updatePost({
        ...currentPost,
        content: transcript,
      });
    }
    setIsContentHubModalOpen(false);
  };

  const handleSavePost = async () => {
    try {
      await handleSave();
      router.push("/dashboard/posts");
    } catch (error) {
      setApiError("Failed to save post. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <PostHeader
          title={currentPost?.title || ""}
          setTitle={(title) =>
            currentPost && updatePost({ ...currentPost, title })
          }
          onSave={handleSavePost}
          onDelete={() => router.push("/dashboard/posts")}
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
    </div>
  );
};

export default CreatePostPage;
