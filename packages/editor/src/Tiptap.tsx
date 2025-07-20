import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useMemo } from "react";
import { Toolbar } from "./components/Toolbar";
import "./styles.css";

type TiptapProps = {
  content?: JSONContent;
  onChange?: (content: JSONContent) => void;
  editable?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
};

const Tiptap = ({
  content = { type: "doc", content: [{ type: "paragraph" }] },
  onChange,
  editable = true,
  placeholder = "Start writing...",
  autoFocus = false,
}: TiptapProps): JSX.Element => {
  const extensions = useMemo(
    () => [
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      HorizontalRule,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyleKit,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content,
    editable,
    immediatelyRender: false,
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      console.log("Editor JSON:", jsonContent);
      if (onChange) {
        onChange(jsonContent);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl dark:prose-invert mx-auto focus:outline-none p-4",
        "data-placeholder": placeholder,
      },
    },
  });

  return (
    <div>
      {editable && <Toolbar editor={editor} />}
      <div className="prose-editor-content relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;
