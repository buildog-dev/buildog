import { Editor } from "@tiptap/react";
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  Code,
  TextHOne,
  TextHTwo,
  TextHThree,
  ListNumbers,
  Quotes,
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
  Plus,
  CaretDown,
  ListBullets,
  ListChecks,
} from "@phosphor-icons/react";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps): JSX.Element | null => {
  if (!editor) {
    return null;
  }

  const getCurrentHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    return "H1";
  };

  const getCurrentList = () => {
    if (editor.isActive("bulletList")) return <ListBullets className="h-4 w-4" />;
    if (editor.isActive("orderedList")) return <ListNumbers className="h-4 w-4" />;
    if (editor.isActive("taskList")) return <ListChecks className="h-4 w-4" />;
    return <ListBullets className="h-4 w-4" />;
  };

  // Check if user is on the first paragraph/position
  const isOnFirstParagraph = () => {
    const doc = editor.state.doc;
    let blockCount = 0;
    doc.descendants((node) => {
      if (node.isBlock) {
        blockCount++;
      }
    });
    return blockCount <= 1;
  };

  const headersEnabled = isOnFirstParagraph();

  return (
    <div className="border-b p-2 flex flex-wrap gap-1">
      {/* Undo/Redo */}
      <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
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

      {/* Heading Dropdown - Only headers are grouped */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="mr-2" disabled={!headersEnabled}>
            {getCurrentHeading()}
            <CaretDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              if (headersEnabled) {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
              }
            }}
            disabled={!headersEnabled}
          >
            <TextHOne className="h-4 w-4 mr-2" />
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (headersEnabled) {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              }
            }}
            disabled={!headersEnabled}
          >
            <TextHTwo className="h-4 w-4 mr-2" />
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (headersEnabled) {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              }
            }}
            disabled={!headersEnabled}
          >
            <TextHThree className="h-4 w-4 mr-2" />
            Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Text Formatting */}
      <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
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

      {/* Lists Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="mr-2">
            {getCurrentList()}
            <CaretDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <ListBullets className="h-4 w-4 mr-2" />
            Bullet List
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListNumbers className="h-4 w-4 mr-2" />
            Ordered List
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (editor.isActive("taskList")) {
                editor.chain().focus().liftListItem("taskItem").run();
              } else {
                editor.chain().focus().toggleList("taskList", "taskItem").run();
              }
            }}
          >
            <ListChecks className="h-4 w-4 mr-2" />
            Task List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Other Formatting */}
      <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <Button
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quotes className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Alignment */}
      <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
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
      <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
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

      {/* Add Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add
      </Button>
    </div>
  );
};
