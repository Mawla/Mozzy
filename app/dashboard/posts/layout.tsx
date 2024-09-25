import React from "react";
import { PostProvider } from "@/app/providers/PostProvider";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PostProvider>{children}</PostProvider>;
}
