import { postService } from "@/app/services/postService";

// Mock the anthropic actions
jest.mock("@/app/actions/anthropicActions");

describe("Post Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create new post", async () => {
    const result = await postService.createNewPost();
    expect(result).toBeDefined();
  });

  it("should get posts", () => {
    const posts = postService.getPosts();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("should handle merge", async () => {
    const result = await postService.handleMerge("1");
    expect(result).toBeDefined();
  });

  it("should manage cancellation state", () => {
    expect(postService.isCancelled).toBe(false);
    postService.cancelOperation();
    expect(postService.isCancelled).toBe(true);
    postService.resetCancellation();
    expect(postService.isCancelled).toBe(false);
  });
});
