import { Button } from "@/components/ui/button";
import Link from "next/link";

const PostsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link href="/dashboard/posts/create">
          <Button>Create New Post</Button>
        </Link>
      </div>
      <p>Manage your blog posts here.</p>
      {/* Add posts management content here */}
    </div>
  );
};

export default PostsPage;
