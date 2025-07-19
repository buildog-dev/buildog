"use client";

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
import { useState, useMemo } from "react";
import { LinkDialog } from "./LinkDialog";
import { ImageDialog } from "./ImageDialog";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps): JSX.Element | null => {
  if (!editor) return null;
  const headingLabel = useMemo(() => {
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    return "H";
  }, [editor]);

  const listIcon = useMemo(() => {
    if (editor.isActive("bulletList")) return <ListBullets />;
    if (editor.isActive("orderedList")) return <ListNumbers />;
    if (editor.isActive("taskList")) return <ListChecks />;
    return <ListBullets />;
  }, [editor]);

  const isOnFirstParagraph = useMemo(() => {
    let blockCount = 0;
    editor.state.doc.descendants((node) => {
      if (node.isBlock) blockCount++;
    });
    return blockCount <= 1;
  }, [editor.state.doc]);

  const [isLinkDialogOpen, setLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);

  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  const canToggleBold = editor.can().chain().focus().toggleBold().run();
  const canToggleItalic = editor.can().chain().focus().toggleItalic().run();
  const canToggleStrike = editor.can().chain().focus().toggleStrike().run();
  const canToggleUnderline = editor.can().chain().focus().toggleUnderline().run();
  const canToggleCode = editor.can().chain().focus().toggleCode().run();
  const canToggleHighlight = editor.can().chain().focus().toggleHighlight().run();

  const canToggleBlockquote = editor.can().chain().focus().toggleBlockquote().run();

  const canInsertTable = editor
    .can()
    .chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run();

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 sticky top-0 z-10">
      {/* Undo / Redo */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.commands.undo()}
          disabled={!canUndo}
        >
          <ArrowCounterClockwise />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.commands.redo()}
          disabled={!canRedo}
        >
          <ArrowClockwise />
        </Button>
      </div>

      {/* Heading Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={!isOnFirstParagraph}>
            {headingLabel} <CaretDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {[1, 2, 3].map((level) => (
            <DropdownMenuItem
              key={`h${level}`}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 })
                  .run()
              }
              disabled={!isOnFirstParagraph}
            >
              {level === 1 ? <TextHOne /> : level === 2 ? <TextHTwo /> : <TextHThree />}
              Heading {level}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Text Style Buttons */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        {[
          {
            icon: <TextB />,
            cmd: "toggleBold",
            active: editor.isActive("bold"),
            can: canToggleBold,
          },
          {
            icon: <TextItalic />,
            cmd: "toggleItalic",
            active: editor.isActive("italic"),
            can: canToggleItalic,
          },
          {
            icon: <TextStrikethrough />,
            cmd: "toggleStrike",
            active: editor.isActive("strike"),
            can: canToggleStrike,
          },
          {
            icon: <TextUnderline />,
            cmd: "toggleUnderline",
            active: editor.isActive("underline"),
            can: canToggleUnderline,
          },
          {
            icon: <Code />,
            cmd: "toggleCode",
            active: editor.isActive("code"),
            can: canToggleCode,
          },
          {
            icon: <Highlighter />,
            cmd: "toggleHighlight",
            active: editor.isActive("highlight"),
            can: canToggleHighlight,
          },
        ].map(({ icon, cmd, active, can }) => (
          <Button
            key={cmd}
            variant={active ? "default" : "outline"}
            size="sm"
            onClick={() => (editor.commands as any)[cmd]()}
            disabled={!can}
          >
            {icon}
          </Button>
        ))}
      </div>

      {/* Lists */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {listIcon} <CaretDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <ListBullets className="mr-2" /> Bullet List
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListNumbers className="mr-2" /> Ordered List
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleTaskList().run()}>
            <ListChecks className="mr-2" /> Task List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Blockquote */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!canToggleBlockquote}
        >
          <Quotes />
        </Button>
      </div>

      {/* Text Alignment */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          variant={editor.isActive("paragraph", { textAlign: "left" }) ? "default" : "outline"}
          size="sm"
          onClick={() =>
            editor.chain().focus().updateAttributes("paragraph", { textAlign: "left" }).run()
          }
        >
          <TextAlignLeft />
        </Button>
        <Button
          variant={editor.isActive("paragraph", { textAlign: "center" }) ? "default" : "outline"}
          size="sm"
          onClick={() =>
            editor.chain().focus().updateAttributes("paragraph", { textAlign: "center" }).run()
          }
        >
          <TextAlignCenter />
        </Button>
        <Button
          variant={editor.isActive("paragraph", { textAlign: "right" }) ? "default" : "outline"}
          size="sm"
          onClick={() =>
            editor.chain().focus().updateAttributes("paragraph", { textAlign: "right" }).run()
          }
        >
          <TextAlignRight />
        </Button>
      </div>

      {/* Link, Image, Table */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          variant={editor.isActive("link") ? "default" : "outline"}
          size="sm"
          onClick={() => setLinkDialogOpen(true)}
        >
          <Link />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setImageDialogOpen(true)}>
          <Image />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          disabled={!canInsertTable}
        >
          <Table />
        </Button>
      </div>

      {/* Horizontal Rule */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Plus className="mr-1" /> Add
      </Button>

      {/* Dialogs */}
      <LinkDialog
        editor={editor}
        isOpen={isLinkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
      />
      <ImageDialog
        editor={editor}
        isOpen={isImageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
      />
    </div>
  );
};
