import { Editor } from "@tiptap/react";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
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
import { useState } from "react";
import { LinkDialog } from "./LinkDialog";
import { ImageDialog } from "./ImageDialog";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps): JSX.Element | null => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  if (!editor) {
    return null;
  }

  const getCurrentHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    return "H";
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
          onClick={() => (editor.commands as any).undo()}
          disabled={!(editor.can() as any).undo()}
        >
          <ArrowCounterClockwise className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => (editor.commands as any).redo()}
          disabled={!(editor.can() as any).redo()}
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
                editor.chain().focus().toggleNode("heading", "paragraph", { level: 1 }).run();
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
                editor.chain().focus().toggleNode("heading", "paragraph", { level: 2 }).run();
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
                editor.chain().focus().toggleNode("heading", "paragraph", { level: 3 }).run();
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
          onClick={() => editor.chain().focus().toggleMark("bold").run()}
          disabled={!editor.can().chain().focus().toggleMark("bold").run()}
        >
          <TextB className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("italic") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleMark("italic").run()}
          disabled={!editor.can().chain().focus().toggleMark("italic").run()}
        >
          <TextItalic className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("strike") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleMark("strike").run()}
          disabled={!editor.can().chain().focus().toggleMark("strike").run()}
        >
          <TextStrikethrough className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("underline") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleMark("underline").run()}
          disabled={!editor.can().chain().focus().toggleMark("underline").run()}
        >
          <TextUnderline className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("code") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleMark("code").run()}
          disabled={!editor.can().chain().focus().toggleMark("code").run()}
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("highlight") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleMark("highlight").run()}
          disabled={!editor.can().chain().focus().toggleMark("highlight").run()}
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
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleList("bulletList", "listItem").run()}
          >
            <ListBullets className="h-4 w-4 mr-2" />
            Bullet List
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleList("orderedList", "listItem").run()}
          >
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
          onClick={() => editor.chain().focus().toggleNode("blockquote", "paragraph").run()}
        >
          <Quotes className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Alignment */}
      <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <Button
          variant={editor.isActive("paragraph", { textAlign: "left" }) ? "default" : "outline"}
          size="sm"
          onClick={() =>
            editor.chain().focus().updateAttributes("paragraph", { textAlign: "left" }).run()
          }
        >
          <TextAlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("paragraph", { textAlign: "center" }) ? "default" : "outline"}
          size="sm"
          onClick={() =>
            editor.chain().focus().updateAttributes("paragraph", { textAlign: "center" }).run()
          }
        >
          <TextAlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("paragraph", { textAlign: "right" }) ? "default" : "outline"}
          size="sm"
          onClick={() =>
            editor.chain().focus().updateAttributes("paragraph", { textAlign: "right" }).run()
          }
        >
          <TextAlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Links and Media */}
      <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
        <Button
          variant={editor.isActive("link") ? "default" : "outline"}
          size="sm"
          onClick={() => setIsLinkDialogOpen(true)}
        >
          <Link className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={() => setIsImageDialogOpen(true)}>
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

      {/* Link Dialog */}
      <LinkDialog
        editor={editor}
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
      />

      {/* Image Dialog */}
      <ImageDialog
        editor={editor}
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
      />
    </div>
  );
};
