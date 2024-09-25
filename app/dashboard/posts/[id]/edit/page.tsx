"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import CreatePostPage from "../../create/page";
import { Post } from "@/app/types/post";

const EditPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState(null);

  useEffect(() => {}, [id, router]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return <CreatePostPage />;
};

export default EditPostPage;
