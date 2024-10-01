import React, { useState } from "react";
import { usePostStore } from "@/app/stores/postStore";
import { postService } from "@/app/services/postService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const ContentTab: React.FC = () => {
  const { currentPost, updatePost } = usePostStore();
  const [transcript, setTranscript] = useState(currentPost.transcript || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranscriptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTranscript(e.target.value);
  };

  const handleCreatePost = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newPost = await postService.createPost(transcript);
      updatePost(newPost);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={transcript}
        onChange={handleTranscriptChange}
        placeholder="Enter your transcript here..."
        rows={10}
      />
      <Button onClick={handleCreatePost} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Post"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
