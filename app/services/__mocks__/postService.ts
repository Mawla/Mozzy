export const postService = {
  isCancelled: false,
  cancelOperation: jest.fn(),
  resetCancellation: jest.fn(),
  getPacks: jest.fn().mockReturnValue([]),
  getPosts: jest.fn().mockReturnValue([]),
  getPostById: jest.fn().mockReturnValue(null),
  createNewPost: jest.fn().mockReturnValue({ id: "1", title: "New Post" }),
  handleMerge: jest.fn().mockResolvedValue({}),
  // ... add other required methods from the interface
};
