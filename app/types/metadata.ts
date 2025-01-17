export interface Metadata {
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author?: string;
  status?: "draft" | "published";
  version?: string;
}
