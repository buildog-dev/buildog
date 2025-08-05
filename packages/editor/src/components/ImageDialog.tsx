import React, { useState, useRef } from "react";
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

interface ImageDialogProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageDialog = ({ editor, isOpen, onClose }: ImageDialogProps): JSX.Element => {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(
      "File selected:",
      file ? { name: file.name, type: file.type, size: file.size } : null
    );

    if (file && file.type.startsWith("image/")) {
      // Check file size (limit to 10MB for practical purposes)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert("The selected image is too large. Please choose an image smaller than 10MB.");
        return;
      }

      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log("File read successfully, data URL length:", result?.length || 0);
        if (result) {
          setUrl(result);
          // Auto-generate alt text from filename
          const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          if (!alt.trim()) {
            setAlt(fileName);
          }
          console.log("URL and alt text set successfully");
        }
        setIsLoading(false);
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
        console.error("FileReader error details:", reader.error);
        setIsLoading(false);
        // Show user-friendly error
        alert("Error reading the image file. Please try a different image.");
      };
      reader.readAsDataURL(file);
    } else if (file) {
      // File was selected but it's not an image
      console.warn("Selected file is not an image:", file.type);
      alert(`The selected file type (${file.type}) is not supported. Please select an image file.`);
    } else {
      console.log("No file selected");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!url.trim()) return;

    console.log("Attempting to save image with URL:", url.substring(0, 50) + "...");
    console.log("Alt text:", alt);

    const formattedUrl =
      url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    console.log("Formatted URL starts with:", formattedUrl.substring(0, 50) + "...");

    try {
      editor
        .chain()
        .focus()
        .setImage({
          src: formattedUrl,
          alt: alt.trim() || "Image",
        })
        .run();

      console.log("Image inserted successfully");
      handleClose();
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const handleClose = () => {
    setUrl("");
    setAlt("");
    setIsLoading(false);
    // clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Add an image to your document. Enter an image URL or upload an image file from your
            computer.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image-url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                autoFocus
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseClick}
                className="shrink-0"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Browse"}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="alt-text">Alt Text (optional)</Label>
            <Input
              id="alt-text"
              placeholder="Description of the image"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!url.trim()}>
            Insert Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
