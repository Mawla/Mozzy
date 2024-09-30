"use client";

import { useEffect } from "react";
import { usePostStore } from "@/app/stores/postStore";

const DashboardPage = () => {
  const { loadPosts, posts } = usePostStore();

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
      <p>
        Welcome to your dashboard. Here you can view key metrics and summaries.
      </p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Recent Posts</h2>
        <ul className="list-disc pl-5">
          {posts.slice(0, 5).map((post) => (
            <li key={post.id}>{post.title || "Untitled Post"}</li>
          ))}
        </ul>
      </div>
      {/* Add more dashboard widgets, charts, or summary cards here */}
    </div>
  );
};

export default DashboardPage;
