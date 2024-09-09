export interface ContentItem {
  id: string;
  title: string;
  transcript: string;
  otherFields: {
    date: string;
    tags: string;
    [key: string]: string;
  };
}
