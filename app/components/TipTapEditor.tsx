import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TipTapEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
  height?: string;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onUpdate,
  placeholder = "Start typing...",
  height = "400px",
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== undefined) {
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
