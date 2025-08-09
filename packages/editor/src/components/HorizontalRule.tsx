import { Button } from "@ui/components/ui/button";
import { Plus } from "@ui/components/react-icons";
import type { Editor } from "@tiptap/react";

export const HorizontalRule = ({ editor }: { editor: Editor }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => editor.chain().focus().setHorizontalRule().run()}
  >
    <Plus className="mr-1" /> Add
  </Button>
);
