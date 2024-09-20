import { Template } from "./template";

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  tweetThreadContent: string[];
  transcript: string;
  mergedContents: { [templateId: string]: string };
  createdAt: string;
  updatedAt: string;
  templateIds: string[];
  templates?: Template[];
}
