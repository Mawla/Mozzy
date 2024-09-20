"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { postService } from "@/app/services/postService";
import Link from "next/link";
import { Post } from "@/app/types/post";

const ViewPostPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = () => {
      if (id === "new") {
        setPost(null); // This will trigger the creation of a new post in PostContent
      } else {
        const fetchedPost = postService.getPostById(id);
        if (fetchedPost) {
          setPost(fetchedPost);
          console.log("Fetched post:", fetchedPost);
        } else {
          router.push("/dashboard/posts");
        }
      }
      setLoading(false);
    };

    fetchPost();
  }, [id, router]);

  const handleSave = (updatedPost: Partial<Post>) => {
    const newPost = post ? { ...post, ...updatedPost } : (updatedPost as Post);
    postService.handleSave(newPost);
    setPost(newPost);
  };

  const handleDelete = () => {
    if (post && window.confirm("Are you sure you want to delete this post?")) {
      postService.deletePost(post.id);
      router.push("/dashboard/posts");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <Link href="/dashboard/posts" passHref>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
          </Button>
        </Link>
        {post && (
          <div>
            <Link href={`/dashboard/posts/${post.id}/edit`} passHref>
              <Button variant="outline" className="mr-2">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        )}
      </div>

      <PostContent post={post} isViewMode={false} onSave={handleSave} />
    </div>
  );
};

export default ViewPostPage;
