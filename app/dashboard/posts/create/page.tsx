"use client";
import React, { useEffect, useCallback } from "react";
import { useCreatePost } from "@/app/hooks/useCreatePost";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { ProgressNotes } from "@/app/components/dashboard/posts/ProgressNotes";
import { Button } from "@/components/ui/button";
import ContentHubImportModal from "@/app/components/dashboard/posts/ContentHubImportModal";
import ApiErrorMessage from "@/app/components/ApiErrorMessage";
import { Trash2 } from "lucide-react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import { postService } from "@/app/services/postService";
import { useState } from "react";
import debounce from "lodash/debounce";
import { Post } from "@/app/types/post";

const CreatePostPage = () => {
  const { post, updatePost, progressNotes, apiError } = useCreatePost();
  const [isContentHubModalOpen, setIsContentHubModalOpen] = useState(false);

  const debouncedSavePost = useCallback(
    debounce((postToSave: Post) => {
      postService.saveToLocalStorage("post", JSON.stringify(postToSave));
    }, 500),
    []
  );

  useEffect(() => {
    if (post) {
      debouncedSavePost(post);
    }
  }, [post, debouncedSavePost]);

  const handleClear = () => {
    if (post) {
      updatePost({
        ...post,
        content: "",
        title: "",
      });
    }
  };

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
        onImport={handleImportTranscript}
      />
      {apiError && post && (
        <ApiErrorMessage
          error={apiError}
          onClose={() => updatePost({ ...post, apiError: null } as Post)}
        />
      )}
    </div>
  );
};

export default CreatePostPage;
