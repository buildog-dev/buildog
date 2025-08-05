import { Button } from "@ui/components/ui/button";
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
  Code,
  Highlighter,
} from "@ui/components/react-icons";
import type { Editor } from "@tiptap/react";

export const StyleButtons = ({
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
