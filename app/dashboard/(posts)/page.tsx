import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for posts
const posts = [
  { id: 1, title: "First Post", excerpt: "This is the first post..." },
  { id: 2, title: "Second Post", excerpt: "This is the second post..." },
  { id: 3, title: "Third Post", excerpt: "This is the third post..." },
];

export default function Posts() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Button>Create New Post</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{post.excerpt}</p>
              <Link
                href={`/posts/${post.id}`}
                className="mt-4 inline-block text-primary hover:underline"
              >
                Read more
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
