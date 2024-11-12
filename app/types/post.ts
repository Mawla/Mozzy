import { Template } from "./template";
import { ContentMetadata } from "./contentMetadata";

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  tweetThreadContent: string[];
  transcript: string;
  mergedContents: { [key: string]: string };
  createdAt: string;
  updatedAt: string;
  templateIds: string[];
  templates: Template[];
  metadata?: ContentMetadata;
  refinementInstructions?: string;
  mergeInstructions?: string;
}
