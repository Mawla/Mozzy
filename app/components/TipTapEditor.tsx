import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TipTapEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getText());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getText()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="border border-gray-200 rounded-md p-4 bg-white h-[400px] overflow-y-auto">
      <style jsx global>{`
        .ProseMirror {
          outline: none !important;
          height: 100%;
        }
        .ProseMirror * {
          outline: none !important;
        }
      `}</style>
      <EditorContent
        editor={editor}
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none h-full"
      />
    </div>
  );
};

export default TipTapEditor;
