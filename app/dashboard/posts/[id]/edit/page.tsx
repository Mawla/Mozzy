"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CreatePostPage from "../../create/page";

const EditPostPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    const foundPost = savedPosts.find((p) => p.id === id);
    if (foundPost) {
      setPost(foundPost);
    } else {
      // Handle post not found
      router.push("/dashboard/posts");
    }
  }, [id, router]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return <CreatePostPage initialPost={post} isEditing={true} />;
};

export default EditPostPage;
