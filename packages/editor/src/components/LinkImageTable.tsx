import { Button } from "@ui/components/ui/button";
import { Link, Image, Table } from "@ui/components/react-icons";
import type { Editor } from "@tiptap/react";

export const LinkImageTable = ({
  editor,
  showLink,
  showImage,
  showTable,
  setLinkDialogOpen,
  setImageDialogOpen,
  canInsertTable,
}: {
  editor: Editor;
  showLink: boolean;
  showImage: boolean;
  showTable: boolean;
  setLinkDialogOpen: (open: boolean) => void;
  setImageDialogOpen: (open: boolean) => void;
  canInsertTable: boolean;
}) => (
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
);
