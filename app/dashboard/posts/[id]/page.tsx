"use client";

import React, { useEffect } from "react";
import { usePostStore } from "@/app/stores/postStore";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { useRouter } from "next/navigation";

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { loadPost, currentPost, updatePost, deletePost, handleSave } =
    usePostStore();

  useEffect(() => {
    loadPost(params.id);
  }, [params.id, loadPost]);

  if (!currentPost) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    await deletePost(currentPost.id);
    router.push("/dashboard/posts");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PostHeader
        title={currentPost.title}
        setTitle={(title) => updatePost({ title })}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <PostContent />
    </div>
  );
}
