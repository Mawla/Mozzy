import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Extension } from "@tiptap/core";

// Custom extension to preserve whitespace
const PreserveWhitespace = Extension.create({
  name: "preserveWhitespace",
  addOptions() {
    return {
      types: ["paragraph", "heading"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          whitespace: {
            default: "pre-wrap",
            parseHTML: (element) => element.style.whiteSpace,
            renderHTML: (attributes) => {
              if (!attributes.whitespace) {
                return {};
              }
              return {
                style: `white-space: ${attributes.whitespace}`,
              };
            },
          },
        },
      },
    ];
  },
});

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
    extensions: [
      StarterKit,
      PreserveWhitespace.configure({
        types: ["paragraph", "heading"],
      }),
    ],
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
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div
      className={`border border-gray-200 rounded-md p-4 bg-white h-[${height}] overflow-y-auto relative`}
    >
      <style jsx global>{`
        .ProseMirror {
          outline: none !important;
          height: 100%;
          font-size: 16px;
          line-height: 1.5;
          white-space: pre-wrap !important;
        }
        .ProseMirror p,
        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3,
        .ProseMirror h4,
        .ProseMirror h5,
        .ProseMirror h6 {
          margin: 0;
          white-space: pre-wrap !important;
        }
        .ProseMirror * {
          outline: none !important;
        }
      `}</style>
      <EditorContent editor={editor} className="prose max-w-none h-full" />
      {editor && !editor.getText() && (
        <p className="text-gray-400 absolute top-[1.2rem] left-[1.2rem] pointer-events-none text-base">
          {placeholder}
        </p>
      )}
    </div>
  );
};

export default TipTapEditor;
