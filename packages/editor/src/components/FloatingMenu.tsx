import { FloatingMenu as TiptapFloatingMenu } from "@tiptap/react";
import { Editor } from "@tiptap/react";
import { Button } from "@repo/ui/components/ui/button";
import { TextHOne, TextHTwo, List, ListNumbers, Quotes, Image, Table } from "@phosphor-icons/react";

interface FloatingMenuProps {
  editor: Editor | null;
}

export const FloatingMenu = ({ editor }: FloatingMenuProps): JSX.Element | null => {
  if (!editor) {
    return null;
  }

  return (
    <TiptapFloatingMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-1"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="text-xs"
      >
        <TextHOne className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="text-xs"
      >
        <TextHTwo className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="text-xs"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="text-xs"
      >
        <ListNumbers className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className="text-xs"
      >
        <Quotes className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const url = window.prompt("Enter image URL:");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="text-xs"
      >
        <Image className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
        className="text-xs"
      >
        <Table className="h-4 w-4" />
      </Button>
    </TiptapFloatingMenu>
  );
};
