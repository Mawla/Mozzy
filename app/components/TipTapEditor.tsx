import React, { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Extension } from "@tiptap/core";
import OrderedList from "@tiptap/extension-ordered-list";

// Custom extension to preserve whitespace and line breaks
const PreserveLineBreaks = Extension.create({
  name: "preserveLineBreaks",
  addNodeView() {
    return {
      dom: document.createElement("br"),
    };
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
      StarterKit.configure({
        orderedList: false,
      }),
      PreserveLineBreaks,
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate(html);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none w-full h-full",
      },
    },
    parseOptions: {
      preserveWhitespace: "full",
    },
    autofocus: false,
  });

  const updateContent = useCallback(
    (newContent: string) => {
      if (editor && newContent !== editor.getHTML()) {
        // Preserve line breaks and convert them to <br> tags
        const contentWithLineBreaks = newContent
          .split("\n")
          .map((line) => line.trim())
          .join("<br>\n");
        editor.commands.setContent(contentWithLineBreaks, false);
      }
    },
    [editor]
  );

  useEffect(() => {
    updateContent(content);
  }, [content, updateContent]);

  const handleContainerClick = useCallback(() => {
    if (editor) {
      editor.chain().focus().run();
    }
  }, [editor]);

  return (
    <div
      className={`border border-gray-200 rounded-md p-4 bg-white h-[${height}] overflow-y-auto relative cursor-text`}
      onClick={handleContainerClick}
    >
      <style jsx global>{`
        .ProseMirror {
          outline: none !important;
          height: 100%;
          font-size: 16px;
          line-height: 1.5;
          white-space: pre-wrap !important;
          cursor: text;
        }
        .ProseMirror p {
          margin: 0 0 1em 0;
          white-space: pre-wrap !important;
        }
        .ProseMirror br {
          display: block;
          content: "";
          margin-top: 0.5em;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
        }
        .ProseMirror ol li {
          margin-bottom: 0.5em;
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
