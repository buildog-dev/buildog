"use client";

import type { Editor } from "@tiptap/react";
import type { AnyExtension } from "@tiptap/core";
import { useState, useCallback } from "react";
import { UndoRedo } from "./UndoRedo";
import { Heading } from "./Heading";
import { Blockquote } from "./Blockquote";
import { LinkImageTable } from "./LinkImageTable";
import { HorizontalRule } from "./HorizontalRule";
import { LinkDialog } from "./LinkDialog";
import { ImageDialog } from "./ImageDialog";
import { StyleButtons } from "./StyleButtons";
import { ListDropdown } from "./ListDropdown";
import { TextAlignButtons } from "./TextAlignButtons";

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
      <UndoRedo editor={editor} canUndo={canUndo} canRedo={canRedo} />

      {/* Heading */}
      {showHeading && (
        <Heading editor={editor} headingLevels={headingLevels} activeHeading={activeHeading} />
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
      {showBlockquote && <Blockquote editor={editor} canBlockquote={canBlockquote} />}

      {/* Text Align */}
      {showTextAlign && <TextAlignButtons editor={editor} />}

      {/* Link, Image, Table */}
      {(showLink || showImage || showTable) && (
        <LinkImageTable
          editor={editor}
          showLink={showLink}
          showImage={showImage}
          showTable={showTable}
          setLinkDialogOpen={setLinkDialogOpen}
          setImageDialogOpen={setImageDialogOpen}
          canInsertTable={canInsertTable}
        />
      )}

      {/* Horizontal Rule */}
      {showHorizontalRule && <HorizontalRule editor={editor} />}

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
