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
import { useState } from "react";
import { LinkDialog } from "./LinkDialog";
import { ImageDialog } from "./ImageDialog";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps): JSX.Element | null => {
  if (!editor) return null;

  // helper to check if an extension is enabled
  const hasExtension = (name: string) =>
    editor.extensionManager.extensions.some((ext: any) => ext.name === name);

  // dialog state
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

  let headingLevels: number[] = [1, 2, 3];
  if (showHeading) {
    const headingExt = editor.extensionManager.extensions.find((e: any) => e.name === "heading");
    if (headingExt && headingExt.options && Array.isArray(headingExt.options.levels)) {
      headingLevels = headingExt.options.levels;
    }
  }

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
      {showHeading && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {headingLevels
                .map((level) =>
                  editor.isActive("heading", { level: level as 1 | 2 | 3 }) ? `H${level}` : null
                )
                .find(Boolean) || "H"}{" "}
              <CaretDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {headingLevels.map((level) => (
              <DropdownMenuItem
                key={`h${level}`}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as 1 | 2 | 3 })
                    .run()
                }
              >
                {level === 1 ? <TextHOne /> : level === 2 ? <TextHTwo /> : <TextHThree />}
                Heading {level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Text Style Buttons */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        {showBold && (
          <Button
            variant={editor.isActive("bold") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <TextB />
          </Button>
        )}
        {showItalic && (
          <Button
            variant={editor.isActive("italic") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <TextItalic />
          </Button>
        )}
        {showStrike && (
          <Button
            variant={editor.isActive("strike") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
          >
            <TextStrikethrough />
          </Button>
        )}
        {showUnderline && (
          <Button
            variant={editor.isActive("underline") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
          >
            <TextUnderline />
          </Button>
        )}
        {showCode && (
          <Button
            variant={editor.isActive("code") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
          >
            <Code />
          </Button>
        )}
        {showHighlight && (
          <Button
            variant={editor.isActive("highlight") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            disabled={!editor.can().chain().focus().toggleHighlight().run()}
          >
            <Highlighter />
          </Button>
        )}
      </div>

      {/* Lists Dropdown */}
      {(showBulletList || showOrderedList || showTaskList) && (
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
              <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <ListBullets className="mr-2" /> Bullet List
              </DropdownMenuItem>
            )}
            {showOrderedList && (
              <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListNumbers className="mr-2" /> Ordered List
              </DropdownMenuItem>
            )}
            {showTaskList && (
              <DropdownMenuItem onClick={() => editor.chain().focus().toggleTaskList().run()}>
                <ListChecks className="mr-2" /> Task List
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Blockquote */}
      {showBlockquote && (
        <div className="flex gap-1 border-r pr-2 mr-2">
          <Button
            variant={editor.isActive("blockquote") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          >
            <Quotes />
          </Button>
        </div>
      )}

      {/* Text Alignment */}
      {showTextAlign && (
        <div className="flex gap-1 border-r pr-2 mr-2">
          <Button
            variant={editor.isActive("paragraph", { textAlign: "left" }) ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <TextAlignLeft />
          </Button>
          <Button
            variant={editor.isActive("paragraph", { textAlign: "center" }) ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <TextAlignCenter />
          </Button>
          <Button
            variant={editor.isActive("paragraph", { textAlign: "right" }) ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <TextAlignRight />
          </Button>
        </div>
      )}

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
              disabled={
                !editor
                  .can()
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
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
