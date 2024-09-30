"use client";
import { PostProvider } from "@/app/providers/PostProvider";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PostProvider>{children}</PostProvider>;
}
