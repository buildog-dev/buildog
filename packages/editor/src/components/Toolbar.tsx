"use client";

import type { Editor } from "@tiptap/react";
import type { AnyExtension } from "@tiptap/core";
import { useState, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Button } from "@ui/components/ui/button";
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
  Code,
  Highlighter,
  ListBullets,
  ListNumbers,
  ListChecks,
  CaretDown,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  ArrowCounterClockwise,
  ArrowClockwise,
  TextHOne,
  TextHTwo,
  TextHThree,
  Quotes,
  Link,
  Image,
  Table,
  Plus,
} from "@ui/components/react-icons";
import { LinkDialog } from "./LinkDialog";
import { ImageDialog } from "./ImageDialog";

type ExtensionName =
  | "bold"
  | "italic"
  | "strike"
  | "underline"
  | "code"
  | "highlight"
  | "blockquote"
  | "bulletList"
  | "orderedList"
  | "taskList"
  | "heading"
  | "link"
  | "image"
  | "table"
  | "horizontalRule"
  | "textAlign";

interface ToolbarProps {
  editor: Editor | null;
}

const StyleButtons = ({
  editor,
  showBold,
  showItalic,
  showStrike,
  showUnderline,
  showCode,
  showHighlight,
}: {
  editor: Editor;
  showBold: boolean;
  showItalic: boolean;
  showStrike: boolean;
  showUnderline: boolean;
  showCode: boolean;
  showHighlight: boolean;
}) => {
  const canBold = editor.can().chain().focus().toggleBold().run();
  const canItalic = editor.can().chain().focus().toggleItalic().run();
  const canStrike = editor.can().chain().focus().toggleStrike().run();
  const canUnderline = editor.can().chain().focus().toggleUnderline().run();
  const canCode = editor.can().chain().focus().toggleCode().run();
  const canHighlight = editor.can().chain().focus().toggleHighlight().run();

  return (
    <div className="flex gap-1 border-r pr-2 mr-2">
      {showBold && (
        <Button
          variant={editor.isActive("bold") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!canBold}
        >
          <TextB />
        </Button>
      )}
      {showItalic && (
        <Button
          variant={editor.isActive("italic") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!canItalic}
        >
          <TextItalic />
        </Button>
      )}
      {showStrike && (
        <Button
          variant={editor.isActive("strike") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!canStrike}
        >
          <TextStrikethrough />
        </Button>
      )}
      {showUnderline && (
        <Button
          variant={editor.isActive("underline") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!canUnderline}
        >
          <TextUnderline />
        </Button>
      )}
      {showCode && (
        <Button
          variant={editor.isActive("code") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!canCode}
        >
          <Code />
        </Button>
      )}
      {showHighlight && (
        <Button
          variant={editor.isActive("highlight") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          disabled={!canHighlight}
        >
          <Highlighter />
        </Button>
      )}
    </div>
  );
};

const ListDropdown = ({
  editor,
  showBulletList,
  showOrderedList,
  showTaskList,
}: {
  editor: Editor;
  showBulletList: boolean;
  showOrderedList: boolean;
  showTaskList: boolean;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm">
        {editor.isActive("bulletList") ? (
          <ListBullets />
        ) : editor.isActive("orderedList") ? (
          <ListNumbers />
        ) : editor.isActive("taskList") ? (
          <ListChecks />
        ) : (
          <ListBullets />
        )}
        <CaretDown />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {showBulletList && (
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBullets className="mr-2" /> Bullet List
        </DropdownMenuItem>
      )}
      {showOrderedList && (
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListNumbers className="mr-2" /> Ordered List
        </DropdownMenuItem>
      )}
      {showTaskList && (
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <ListChecks className="mr-2" /> Task List
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

const TextAlignButtons = ({ editor }: { editor: Editor }) => (
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

export const Toolbar = ({ editor }: ToolbarProps): JSX.Element | null => {
  if (!editor) return null;

  const hasExtension = useCallback(
    (name: ExtensionName): boolean =>
      editor.extensionManager.extensions.some((ext: AnyExtension) => ext.name === name),
    [editor.extensionManager.extensions]
  );

  const [isLinkDialogOpen, setLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);

  const showBold = hasExtension("bold");
  const showItalic = hasExtension("italic");
  const showStrike = hasExtension("strike");
  const showUnderline = hasExtension("underline");
  const showCode = hasExtension("code");
  const showHighlight = hasExtension("highlight");
  const showBlockquote = hasExtension("blockquote");
  const showBulletList = hasExtension("bulletList");
  const showOrderedList = hasExtension("orderedList");
  const showTaskList = hasExtension("taskList");
  const showHeading = hasExtension("heading");
  const showLink = hasExtension("link");
  const showImage = hasExtension("image");
  const showTable = hasExtension("table");
  const showHorizontalRule = hasExtension("horizontalRule");
  const showTextAlign = hasExtension("textAlign");

  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  const headingLevels: Array<1 | 2 | 3> = [1, 2, 3];

  const activeHeading = headingLevels.find((level: 1 | 2 | 3) =>
    editor.isActive("heading", { level })
  );

  const canBlockquote = editor.can().chain().focus().toggleBlockquote().run();
  const canInsertTable = editor
    .can()
    .chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run();

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 sticky top-0 z-10 justify-center">
      {/* Undo / Redo */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.commands.undo()}
          disabled={!canUndo}
        >
          <ArrowCounterClockwise className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.commands.redo()}
          disabled={!canRedo}
        >
          <ArrowClockwise className="h-4 w-4" />
        </Button>
      </div>
      {/* Heading */}
      {showHeading && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {activeHeading ? `H${activeHeading}` : "H"} <CaretDown className="ml-1  h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {headingLevels.map((level: 1 | 2 | 3) => (
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                key={`h${level}`}
                onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              >
                {level === 1 ? <TextHOne /> : level === 2 ? <TextHTwo /> : <TextHThree />}
                Heading {level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Styles */}
      <StyleButtons
        editor={editor}
        showBold={showBold}
        showItalic={showItalic}
        showStrike={showStrike}
        showUnderline={showUnderline}
        showCode={showCode}
        showHighlight={showHighlight}
      />

      {/* Lists */}
      {(showBulletList || showOrderedList || showTaskList) && (
        <ListDropdown
          editor={editor}
          showBulletList={showBulletList}
          showOrderedList={showOrderedList}
          showTaskList={showTaskList}
        />
      )}

      {/* Blockquote */}
      {showBlockquote && (
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
      )}

      {/* Text Align */}
      {showTextAlign && <TextAlignButtons editor={editor} />}

      {/* Link, Image, Table */}
      {(showLink || showImage || showTable) && (
        <div className="flex gap-1 border-r pr-2 mr-2">
          {showLink && (
            <Button
              variant={editor.isActive("link") ? "default" : "outline"}
              size="sm"
              onClick={() => setLinkDialogOpen(true)}
            >
              <Link />
            </Button>
          )}
          {showImage && (
            <Button variant="outline" size="sm" onClick={() => setImageDialogOpen(true)}>
              <Image />
            </Button>
          )}
          {showTable && (
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
          )}
        </div>
      )}

      {/* Horizontal Rule */}
      {showHorizontalRule && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Plus className="mr-1" /> Add
        </Button>
      )}

      {/* Dialogs */}
      {showLink && (
        <LinkDialog
          editor={editor}
          isOpen={isLinkDialogOpen}
          onClose={() => setLinkDialogOpen(false)}
        />
      )}
      {showImage && (
        <ImageDialog
          editor={editor}
          isOpen={isImageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
        />
      )}
    </div>
  );
};
