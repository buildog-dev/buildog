import { useState } from "react";
import Tiptap from "./Tiptap";

interface EditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
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
  const [content, setContent] = useState(initialContent || "");

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = () => {
    if (!content.trim()) return;
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
      {onSave && editable && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Document
          </button>
        </div>
      )}
    </div>
  );
}
