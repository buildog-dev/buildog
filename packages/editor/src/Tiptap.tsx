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
import { useEffect, useRef, useCallback, useMemo } from "react";
import { Toolbar } from "./components/Toolbar";
import "./styles.css";

type TiptapProps = {
  content?: JSONContent;
  onChange?: (content: JSONContent) => void;
  onAutoSave?: (blogData: BlogData) => void;
  editable?: boolean;
  placeholder?: string;
};

interface BlogData {
  header: string | null;
  content: string;
  image: string | null;
}

const Tiptap = ({
  content = { type: "doc", content: [{ type: "paragraph" }] },
  onChange,
  onAutoSave,
  editable = true,
  placeholder = "Start writing...",
}: TiptapProps): JSX.Element => {
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>("");

  const extractBlogData = useCallback((htmlContent: string, editorInstance?: any): BlogData => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const headerElement = doc.querySelector("h1, h2, h3");
    const header = headerElement ? headerElement.textContent?.trim() || null : null;

    if (headerElement) headerElement.remove();

    const imageElement = doc.querySelector("img");
    const image = imageElement ? imageElement.getAttribute("src") : null;

    const images = doc.querySelectorAll("img");
    images.forEach((img) => img.remove());

    const contentText = doc.body.textContent || doc.body.innerText || "";

    const cleanContent = contentText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
      .trim();

    return {
      header,
      content: cleanContent,
      image,
    };
  }, []);

  const performAutoSave = useCallback(
    (htmlContent: string) => {
      if (htmlContent !== lastSavedContentRef.current) {
        const blogData = extractBlogData(htmlContent);

        if (
          htmlContent.trim() !== "" &&
          htmlContent.trim() !== "<p></p>" &&
          htmlContent.trim() !== "<p><br></p>"
        ) {
          console.log("Auto-saving blog data:", JSON.stringify(blogData, null, 2));
          if (onAutoSave) {
            onAutoSave(blogData);
          }

          lastSavedContentRef.current = htmlContent;
        }
      }
    },
    [extractBlogData, onAutoSave]
  );

  const setupAutoSave = useCallback(
    (htmlContent: string) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        performAutoSave(htmlContent);
      }, 4000);
    },
    [performAutoSave]
  );

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

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  const saveBlogData = useCallback(() => {
    if (editor) {
      const htmlContent = editor.getHTML();
      const blogData = extractBlogData(htmlContent);
      return blogData;
    }
    return null;
  }, [editor, extractBlogData]);

  useEffect(() => {
    if (editor) {
      (editor as any).saveBlogData = saveBlogData;
    }
  }, [editor, saveBlogData]);

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
