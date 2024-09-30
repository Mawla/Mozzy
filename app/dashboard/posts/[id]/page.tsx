"use client";
import React from "react";
import { useParams } from "next/navigation";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { PostProvider } from "@/app/providers/PostProvider";

const PostPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="container mx-auto p-4">
      <PostContent />
    </div>
  );
};

export default PostPage;
