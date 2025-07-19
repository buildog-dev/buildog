import { useState } from "react";
import Tiptap from "./Tiptap";
import type { JSONContent } from "@tiptap/react";

interface EditorProps {
  initialContent?: JSONContent;
  onSave?: (content: JSONContent) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export default function Editor({
  initialContent,
  onSave,
  placeholder = "Start writing your document...",
  editable = true,
  className = "",
}: EditorProps): JSX.Element {
  const [content, setContent] = useState<JSONContent>(
    initialContent || { type: "doc", content: [{ type: "paragraph" }] }
  );

  const handleContentChange = (newContent: JSONContent) => {
    setContent(newContent);
    console.log("New Content: ", newContent);
  };

  const handleSave = () => {
    if (!content || !content.content || content.content.length === 0) return;
    onSave?.(content);
  };

  return (
    <div className={`tiptap-editor-container ${className}`}>
      <Tiptap
        content={content}
        onChange={handleContentChange}
        editable={editable}
        placeholder={placeholder}
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Document
        </button>
      </div>
    </div>
  );
}
