"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { usePost } from "@/app/providers/PostProvider";

const PostPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { loadPost, post, handleSave, updatePost, deletePost } = usePost();

  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id, loadPost]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
      router.push("/dashboard/posts");
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <PostHeader
        title={post.title}
        setTitle={(title) => updatePost({ title })}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <PostContent />
    </div>
  );
};

export default PostPage;
