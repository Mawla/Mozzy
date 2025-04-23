import { Template } from "./template";
import { ContentMetadata } from "./contentMetadata";

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  tweet_thread_content: string[];
  transcript: string;
  merged_contents: { [key: string]: string };
  created_at: string;
  updated_at: string;
  template_ids: string[];
  templates: Template[];
  metadata?: ContentMetadata;
  refinement_instructions?: string;
  merge_instructions?: string;
}
