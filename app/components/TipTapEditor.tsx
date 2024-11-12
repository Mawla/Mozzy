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
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
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
        // Preserve line breaks and normalize content
        const cleanContent = newContent
          .replace(/<li>\s*<\/li>/g, "") // Remove empty list items
          .replace(/<ul>\s*<\/ul>/g, "") // Remove empty lists
          .replace(/(<\/li>)\s*(<li>)/g, "$1$2") // Remove spaces between list items
          .replace(/\n\n+/g, "\n\n") // Normalize multiple line breaks to double
          .replace(/(<\/p>)\s*(<p>)/g, "$1\n$2") // Add line break between paragraphs
          .replace(/<br\s*\/?>/g, "\n") // Convert <br> to newline
          .trim();

        // Convert the content to preserve line breaks
        const contentWithLineBreaks = cleanContent
          .split("\n")
          .map((line) => `<p>${line}</p>`)
          .join("\n");

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
          margin: 0;
          white-space: pre-wrap !important;
          min-height: 1.5em;
        }
        .ProseMirror p:empty::before {
          content: "";
          display: inline-block;
        }
        .ProseMirror br {
          display: block;
          height: 1.5em;
          content: "";
          margin-top: 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror li {
          margin: 0.5em 0;
          position: relative;
        }
        .ProseMirror li:empty {
          display: none;
        }
        .ProseMirror ul:empty,
        .ProseMirror ol:empty {
          display: none;
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
