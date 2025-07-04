import { Editor } from "@tiptap/react";
import { Button } from "@repo/ui/components/ui/button";
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  Code,
  TextHOne,
  TextHTwo,
  TextHThree,
  List,
  ListNumbers,
  Quotes,
  Minus,
  ArrowCounterClockwise,
  ArrowClockwise,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextUnderline,
  Highlighter,
  Link,
  Image,
  Table,
} from "@phosphor-icons/react";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps): JSX.Element | null => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
      {/* Text Formatting */}
      <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
        <Button
          variant={editor.isActive("bold") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <TextB className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("italic") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <TextItalic className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("strike") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <TextStrikethrough className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("underline") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
        >
          <TextUnderline className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("code") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("highlight") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          disabled={!editor.can().chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Alignment */}
      <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
        <Button
          variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <TextAlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive({ textAlign: "center" }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <TextAlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive({ textAlign: "right" }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <TextAlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Links and Media */}
      <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
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

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const url = window.prompt("Enter image URL:");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          <Image className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <Table className="h-4 w-4" />
        </Button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
        <Button
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <TextHOne className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <TextHTwo className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <TextHThree className="h-4 w-4" />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
        <Button
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListNumbers className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quotes className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-1 border-r border-gray-200 pr-2 mr-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <ArrowCounterClockwise className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <ArrowClockwise className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
