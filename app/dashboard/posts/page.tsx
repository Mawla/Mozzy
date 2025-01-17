import { getPosts } from "@/app/actions/posts";
import { PostsListing } from "@/app/components/dashboard/posts/PostsListing";
import { logger } from "@/lib/logger";

export default async function PostsPage() {
  try {
    const { data: posts, error } = await getPosts();

    if (error) {
      logger.error("Failed to fetch posts", new Error(error));
      return (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>Error: {error}</p>
        </div>
      );
    }

    return <PostsListing initialPosts={posts || []} />;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch posts";
    logger.error(
      "Unexpected error in posts page",
      err instanceof Error ? err : new Error(errorMessage)
    );
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md">
        <p>Error: An unexpected error occurred</p>
      </div>
    );
  }
}
