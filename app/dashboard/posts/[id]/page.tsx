"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
});

interface SavedPost {
  id: string;
  title: string;
  content: string;
  transcript: string;
  mergedContent: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const ViewPostPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<SavedPost | null>(null);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    const foundPost = savedPosts.find((p: SavedPost) => p.id === id);
    if (foundPost) {
      setPost(foundPost);
    } else {
      // Handle post not found
      router.push("/dashboard/posts");
    }
  }, [id, router]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
      const updatedPosts = savedPosts.filter((p: SavedPost) => p.id !== id);
      localStorage.setItem("savedPosts", JSON.stringify(updatedPosts));
      router.push("/dashboard/posts");
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.push("/dashboard/posts")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
        </Button>
        <div>
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => router.push(`/dashboard/posts/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <div className="text-sm text-gray-500">
            Created: {new Date(post.createdAt).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Updated: {new Date(post.updatedAt).toLocaleString()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Merged Content</h3>
              <div className="mt-2 bg-gray-50 rounded-md">
                <TipTapEditor content={post.mergedContent} editable={false} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Original Transcript
              </h3>
              <div className="mt-2 bg-gray-50 rounded-md">
                <TipTapEditor content={post.transcript} editable={false} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Template</h3>
              <div className="mt-2 bg-gray-50 rounded-md">
                <TipTapEditor content={post.content} editable={false} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewPostPage;
