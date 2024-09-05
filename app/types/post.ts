export interface Post {
  title: string;
  content: string;
  transcript: string;
  mergedContent: string;
  tags: string[];
  suggestedTags: string[];
}

export interface Pack {
  id: string;
  name: string;
  // Add other pack properties as needed
}

export interface Template {
  id: string;
  name: string;
  content: string;
  // Add other template properties as needed
}
