export interface Block {
  id: string;
  type: string;
  content: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface BlockProps {
  block: Block;
  isEditing?: boolean;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}
