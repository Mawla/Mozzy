"use client";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TipTapEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onUpdate,
  placeholder = "Start typing...",
  editable = true,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const plainText = htmlContent
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "\n\n")
        .trim();
      onUpdate(plainText);
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none text-base focus:outline-none h-full",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(
        content
          .split("\n")
          .map((line) => `<p>${line}</p>`)
          .join("")
      );
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 rounded-md p-4 bg-white h-[400px] overflow-y-auto relative">
      <style jsx global>{`
        .ProseMirror {
          outline: none !important;
          height: 100%;
          font-size: 16px;
          line-height: 1.5;
        }
        .ProseMirror p {
          margin: 0;
        }
        .ProseMirror * {
          outline: none !important;
        }
      `}</style>
      <EditorContent editor={editor} className="prose max-w-none h-full" />
      {(!content || content === "<p></p>") && (
        <p className="text-gray-400 absolute top-[1.2rem] left-[1.2rem] pointer-events-none text-base">
          {placeholder}
        </p>
      )}
    </div>
  );
};

export default TipTapEditor;
