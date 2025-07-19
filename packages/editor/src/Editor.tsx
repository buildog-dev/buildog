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

export default function Editor({ initialContent, editable = true }: EditorProps): JSX.Element {
  const [content, setContent] = useState<JSONContent>(
    initialContent || { type: "doc", content: [{ type: "paragraph" }] }
  );

  return (
    <div>
      <Tiptap content={content} editable={editable} />
    </div>
  );
}
