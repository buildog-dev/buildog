import React, { useState, useEffect } from "react";
import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import { Editor } from "@tiptap/react";

interface LinkDialogProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export const LinkDialog = ({ editor, isOpen, onClose }: LinkDialogProps): JSX.Element => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (isOpen) {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);

      const linkMark = editor.getAttributes("link");
      if (linkMark.href) {
        setUrl(linkMark.href);
        setText(selectedText || "");
      } else {
        setUrl("");
        setText(selectedText || "");
      }
    }
  }, [isOpen, editor]);

  const handleSave = () => {
    if (!url.trim()) return;

    const formattedUrl =
      url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;

    if (text.trim()) {
      editor.chain().focus().insertContent(`<a href="${formattedUrl}">${text}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: formattedUrl }).run();
    }
    handleClose();
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    handleClose();
  };

  const handleClose = () => {
    setUrl("");
    setText("");
    onClose();
  };

  const isEditing = editor.isActive("link");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Link" : "Insert Link"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the link URL and display text."
              : "Add a link to your document. Enter the URL and optional display text."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">Display Text (optional)</Label>
            <Input
              id="text"
              placeholder="Link text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {isEditing && (
              <Button variant="destructive" onClick={handleRemoveLink} size="sm">
                Remove Link
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!url.trim()}>
              {isEditing ? "Update" : "Insert"} Link
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
