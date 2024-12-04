export * from "./models";
export * from "./schema";

export interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  duration?: string;
  status: "processing" | "completed" | "error";
  analysis?: {
    keyPoints: string[];
    summary: string;
  };
}
