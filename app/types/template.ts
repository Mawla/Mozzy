export interface Template {
  id: string;
  body: string;
  title: string;
  description: string;
  content: string;
  emoji: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pack {
  id: string;
  name: string;
  emoji: string;
  templates: Template[];
}
