import { Button } from "@ui/components/ui/button";
import { ArrowCounterClockwise, ArrowClockwise } from "@ui/components/react-icons";
import type { Editor } from "@tiptap/react";

export const UndoRedo = ({
  editor,
  canUndo,
  canRedo,
}: {
  editor: Editor;
  canUndo: boolean;
  canRedo: boolean;
}) => (
  <div className="flex gap-1 border-r pr-2 mr-2">
    <Button variant="outline" size="sm" onClick={() => editor.commands.undo()} disabled={!canUndo}>
      <ArrowCounterClockwise className="h-4 w-4" />
    </Button>
    <Button variant="outline" size="sm" onClick={() => editor.commands.redo()} disabled={!canRedo}>
      <ArrowClockwise className="h-4 w-4" />
    </Button>
  </div>
);
