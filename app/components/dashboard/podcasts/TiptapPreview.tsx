"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapPreviewProps {
  content: string;
}

export const TiptapPreview = ({ content }: TiptapPreviewProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
  });

  return <EditorContent editor={editor} className="prose max-w-none" />;
};
