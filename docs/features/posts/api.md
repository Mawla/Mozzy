# Social Posts API Documentation

## Server Actions

### getPosts

- **Purpose**: Fetch all posts for the current user
- **Location**: `app/actions/posts.ts`
- **Usage**:
  ```typescript
  const { data: posts, error } = await getPosts();
  ```
- **Response**:
  ```typescript
  interface GetPostsResponse {
    data?: Post[];
    error?: string;
  }
  ```

### createPost

- **Purpose**: Create a new post
- **Location**: `app/actions/posts.ts`
- **Parameters**:
  ```typescript
  interface CreatePostParams {
    title: string;
    content: string;
    templateId?: string;
  }
  ```
- **Response**:
  ```typescript
  interface CreatePostResponse {
    data?: Post;
    error?: string;
  }
  ```

### updatePost

- **Purpose**: Update an existing post
- **Location**: `app/actions/posts.ts`
- **Parameters**:
  ```typescript
  interface UpdatePostParams {
    id: string;
    title?: string;
    content?: string;
    templateId?: string;
  }
  ```
- **Response**:
  ```typescript
  interface UpdatePostResponse {
    data?: Post;
    error?: string;
  }
  ```

### deletePost

- **Purpose**: Delete a post
- **Location**: `app/actions/posts.ts`
- **Parameters**:
  ```typescript
  interface DeletePostParams {
    id: string;
  }
  ```
- **Response**:
  ```typescript
  interface DeletePostResponse {
    success: boolean;
    error?: string;
  }
  ```

## Types

### Post

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "processing" | "ready" | "published";
}
```

## State Management

### PostStore

- **Location**: `app/stores/postStore.ts`
- **Purpose**: Global state management for posts
- **Key Methods**:
  ```typescript
  interface PostStore {
    currentPost: Post | null;
    createNewPost: () => void;
    loadPost: (id: string) => Promise<void>;
    updatePost: (updates: Partial<Post>) => void;
    handleSave: () => Promise<void>;
    deletePost: (id: string) => Promise<void>;
  }
  ```
