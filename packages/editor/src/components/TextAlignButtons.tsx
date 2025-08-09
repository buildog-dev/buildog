import { Button } from "@ui/components/ui/button";
import { TextAlignLeft, TextAlignCenter, TextAlignRight } from "@ui/components/react-icons";
import type { Editor } from "@tiptap/react";

export const TextAlignButtons = ({ editor }: { editor: Editor }) => (
  <div className="flex gap-1 border-r pr-2 mr-2">
    <Button
      variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
      size="sm"
      onClick={() => editor.chain().focus().setTextAlign("left").run()}
    >
      <TextAlignLeft />
    </Button>
    <Button
      variant={editor.isActive({ textAlign: "center" }) ? "default" : "outline"}
      size="sm"
      onClick={() => editor.chain().focus().setTextAlign("center").run()}
    >
      <TextAlignCenter />
    </Button>
    <Button
      variant={editor.isActive({ textAlign: "right" }) ? "default" : "outline"}
      size="sm"
      onClick={() => editor.chain().focus().setTextAlign("right").run()}
    >
      <TextAlignRight />
    </Button>
  </div>
);
