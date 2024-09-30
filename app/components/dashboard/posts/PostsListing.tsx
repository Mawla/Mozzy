"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { postService } from "@/app/services/postService";
import { Post } from "@/app/types/post";

export const PostsListing: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = () => {
      const fetchedPosts = postService.getPosts();
      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, []);

  const handleSelectPost = (id: string, index: number, shiftKey: boolean) => {
    if (shiftKey && lastSelectedIndex !== null && isSelectMode) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const postsToSelect = posts.slice(start, end + 1).map((post) => post.id);

      setSelectedPosts((prev) => {
        const newSelection = new Set(prev);
        postsToSelect.forEach((postId) => newSelection.add(postId));
        return Array.from(newSelection);
      });
    } else {
      setSelectedPosts((prev) =>
        prev.includes(id)
          ? prev.filter((postId) => postId !== id)
          : [...prev, id]
      );
      setLastSelectedIndex(index);
    }
  };

  const handleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === posts.length ? [] : posts.map((post) => post.id)
    );
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedPosts.length} posts?`
      )
    ) {
      postService.bulkDeletePosts(selectedPosts);
      setPosts((prev) =>
        prev.filter((post) => !selectedPosts.includes(post.id))
      );
      setSelectedPosts([]);
      setIsSelectMode(false);
    }
  };

  const handlePostClick = (
    id: string,
    index: number,
    event: React.MouseEvent
  ) => {
    if (isSelectMode) {
      handleSelectPost(id, index, event.shiftKey);
    } else {
      router.push(`/dashboard/posts/${id}`);
    }
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (!isSelectMode) {
      setSelectedPosts([]);
      setLastSelectedIndex(null);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Posts</h1>
        <div className="space-x-2">
          {isSelectMode && (
            <>
              <Button onClick={handleSelectAll}>
                {selectedPosts.length === posts.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              <Button
                onClick={handleBulkDelete}
                disabled={selectedPosts.length === 0}
              >
                Delete Selected
              </Button>
              <Button onClick={toggleSelectMode}>Cancel</Button>
            </>
          )}
          {!isSelectMode && (
            <Link href="/dashboard/posts/create">
              <Button>Create New Post</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <Card
            key={post.id}
            className={`cursor-pointer hover:shadow-md transition-shadow duration-200 relative group ${
              isSelectMode && selectedPosts.includes(post.id)
                ? "bg-blue-50"
                : ""
            }`}
            onClick={(e) => handlePostClick(post.id, index, e)}
          >
            {!isSelectMode && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectMode();
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center p-4">
              {isSelectMode && (
                <Checkbox
                  checked={selectedPosts.includes(post.id)}
                  onCheckedChange={() => {}}
                  className="mr-4 pointer-events-none"
                />
              )}
              <div className="flex-grow">
                <CardHeader>
                  <CardTitle>{post.title || "Untitled"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {post.content}
                  </p>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
