import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import { Editor } from "@tiptap/react";
import { Button } from "@repo/ui/components/ui/button";
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  Code,
  Link,
  Highlighter,
} from "@phosphor-icons/react";

interface BubbleMenuProps {
  editor: Editor | null;
}

export const BubbleMenu = ({ editor }: BubbleMenuProps): JSX.Element | null => {
  if (!editor) {
    return null;
  }

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-1"
    >
      <Button
        variant={editor.isActive("bold") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <TextB className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("italic") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <TextItalic className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("underline") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <TextUnderline className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("strike") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <TextStrikethrough className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("code") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("highlight") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("link") ? "default" : "outline"}
        size="sm"
        onClick={() => {
          const url = window.prompt("Enter URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        <Link className="h-4 w-4" />
      </Button>
    </TiptapBubbleMenu>
  );
};
