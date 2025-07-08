import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect, useRef, useCallback } from "react";
import { Toolbar } from "./components/Toolbar";
import "./styles.css";

interface TiptapProps {
  content?: string;
  onChange?: (content: string) => void;
  onAutoSave?: (blogData: BlogData) => void;
  editable?: boolean;
  placeholder?: string;
}

interface BlogData {
  header: string | null;
  content: string;
  image: string | null;
}

const Tiptap = ({
  content = "<p>Start writing your document...</p>",
  onChange,
  onAutoSave,
  editable = true,
  placeholder = "Start writing...",
}: TiptapProps): JSX.Element => {
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>("");

  // extract blog data from editor content
  const extractBlogData = useCallback((htmlContent: string, editorInstance?: any): BlogData => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // extract header (first h1, h2, or h3) and remove it from content
    const headerElement = doc.querySelector("h1, h2, h3");
    const header = headerElement ? headerElement.textContent?.trim() || null : null;

    // remove the header element from the DOM to exclude it from content
    if (headerElement) {
      headerElement.remove();
    }

    // extract first image src before converting to text
    const imageElement = doc.querySelector("img");
    const image = imageElement ? imageElement.getAttribute("src") : null;

    // remove images from content as well since we're extracting them separately
    const images = doc.querySelectorAll("img");
    images.forEach((img) => img.remove());

    // get plain text content
    const contentText = doc.body.textContent || doc.body.innerText || "";

    // clean up the text content - remove extra whitespace and empty lines
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

  // auto-save function
  const performAutoSave = useCallback(
    (htmlContent: string) => {
      // Only auto-save if content has changed
      if (htmlContent !== lastSavedContentRef.current) {
        const blogData = extractBlogData(htmlContent);

        // save even if content is minimal
        // only skip completely empty content
        if (
          htmlContent.trim() !== "" &&
          htmlContent.trim() !== "<p></p>" &&
          htmlContent.trim() !== "<p><br></p>"
        ) {
          console.log("Auto-saving blog data:", JSON.stringify(blogData, null, 2));

          // call the onAutoSave callback if provided
          if (onAutoSave) {
            onAutoSave(blogData);
          }

          lastSavedContentRef.current = htmlContent;
        }
      }
    },
    [extractBlogData, onAutoSave]
  );

  // setup auto-save timeout
  const setupAutoSave = useCallback(
    (htmlContent: string) => {
      // clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // set new timeout for 4 seconds
      autoSaveTimeoutRef.current = setTimeout(() => {
        performAutoSave(htmlContent);
      }, 4000);
    },
    [performAutoSave]
  );

  const editor = useEditor({
    extensions: [
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
      TextStyle,
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
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();

      // call the original onChange callback
      if (onChange) {
        onChange(htmlContent);
      }

      // setup auto-save
      setupAutoSave(htmlContent);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl dark:prose-invert mx-auto focus:outline-none min-h-[200px] p-4",
        "data-placeholder": placeholder,
      },
    },
  });

  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // manual save function (can be called externally)
  const saveBlogData = useCallback(() => {
    if (editor) {
      const htmlContent = editor.getHTML();
      const blogData = extractBlogData(htmlContent);
      return blogData;
    }
    return null;
  }, [editor, extractBlogData]);

  // expose save function via ref (if needed)
  useEffect(() => {
    if (editor) {
      (editor as any).saveBlogData = saveBlogData;
    }
  }, [editor, saveBlogData]);

  return (
    <div className=" ">
      {editable && <Toolbar editor={editor} />}
      <div className="prose-editor-content relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;
