import { Button } from "@ui/components/ui/button";
import { Quotes } from "@ui/components/react-icons";
import type { Editor } from "@tiptap/react";

export const Blockquote = ({
  editor,
  canBlockquote,
}: {
  editor: Editor;
  canBlockquote: boolean;
}) => (
  <div className="flex gap-1 border-r pr-2 mr-2">
    <Button
      variant={editor.isActive("blockquote") ? "default" : "outline"}
      size="sm"
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
      disabled={!canBlockquote}
    >
      <Quotes />
    </Button>
  </div>
);
