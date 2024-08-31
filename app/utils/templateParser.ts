export interface Pack {
  id: string;
  name: string;
  emoji: string;
  templates: Template[];
}

export interface Template {
  id: string;
  name: string;
  title: string;
  body: string;
  emoji: string;
  description?: string;
}
