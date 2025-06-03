"use client";

import { $getRoot, $getSelection } from "lexical";
import { useEffect, useCallback, useState, useRef } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import {
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  $isElementNode,
  $createParagraphNode,
  DecoratorNode,
  NodeKey,
  LexicalNode,
  EditorConfig,
  LexicalEditor,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  $isNodeSelection,
  $getNodeByKey,
} from "lexical";

// Node imports
import { HeadingNode, QuoteNode, $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";

export interface ImagePayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  src: string;
  width?: number;
}

const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>("INSERT_IMAGE_COMMAND");

function ImageComponent({
  src,
  altText,
  width,
  height,
  nodeKey,
  editor,
}: {
  src: string;
  altText: string;
  width?: number;
  height?: number;
  nodeKey: NodeKey;
  editor: LexicalEditor;
}) {
  const [isSelected, setIsSelected] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);
  const [currentHeight, setCurrentHeight] = useState(height);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isNodeSelection(selection)) {
          setIsSelected(selection.has(nodeKey));
        } else {
          setIsSelected(false);
        }
      });
      return false;
    };

    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      handleSelectionChange,
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, nodeKey]);

  const handleImageClick = (event: React.MouseEvent) => {
    event.preventDefault();
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.selectNext();
      }
    });
  };

  const handleResizeStart = (event: React.MouseEvent, direction: string) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = currentWidth || imageRef.current?.naturalWidth || 300;
    const startHeight = currentHeight || imageRef.current?.naturalHeight || 200;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes("right")) {
        newWidth = Math.max(50, startWidth + deltaX);
      }
      if (direction.includes("left")) {
        newWidth = Math.max(50, startWidth - deltaX);
      }
      if (direction.includes("bottom")) {
        newHeight = Math.max(50, startHeight + deltaY);
      }
      if (direction.includes("top")) {
        newHeight = Math.max(50, startHeight - deltaY);
      }

      // Maintain aspect ratio when dragging corners
      if (direction.includes("right") || direction.includes("left")) {
        const aspectRatio = imageRef.current.naturalHeight / imageRef.current.naturalWidth;
        newHeight = newWidth * aspectRatio;
      }

      setCurrentWidth(newWidth);
      setCurrentHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);

      // Update the node with new dimensions
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.setWidthAndHeight(currentWidth, currentHeight);
        }
      });

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-block",
        margin: "10px 0",
        cursor: isResizing ? "nw-resize" : "pointer",
        border: isSelected ? "2px solid #007acc" : "2px solid transparent",
        borderRadius: "4px",
      }}
      onClick={handleImageClick}
    >
      <img
        ref={imageRef}
        src={src}
        alt={altText}
        width={currentWidth}
        height={currentHeight}
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
          userSelect: "none",
        }}
        draggable={false}
      />

      {isSelected && (
        <>
          {/* Corner resize handles */}
          <div
            style={{
              position: "absolute",
              top: "-4px",
              left: "-4px",
              width: "8px",
              height: "8px",
              backgroundColor: "#007acc",
              border: "1px solid white",
              borderRadius: "50%",
              cursor: "nw-resize",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleResizeStart(e, "top-left")}
          />
          <div
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              width: "8px",
              height: "8px",
              backgroundColor: "#007acc",
              border: "1px solid white",
              borderRadius: "50%",
              cursor: "ne-resize",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleResizeStart(e, "top-right")}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-4px",
              left: "-4px",
              width: "8px",
              height: "8px",
              backgroundColor: "#007acc",
              border: "1px solid white",
              borderRadius: "50%",
              cursor: "sw-resize",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleResizeStart(e, "bottom-left")}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-4px",
              right: "-4px",
              width: "8px",
              height: "8px",
              backgroundColor: "#007acc",
              border: "1px solid white",
              borderRadius: "50%",
              cursor: "se-resize",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
          />

          {/* Edge resize handles */}
          <div
            style={{
              position: "absolute",
              top: "-4px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "8px",
              height: "8px",
              backgroundColor: "#007acc",
              border: "1px solid white",
              borderRadius: "50%",
              cursor: "n-resize",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleResizeStart(e, "top")}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-4px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "8px",
              height: "8px",
              backgroundColor: "#007acc",
              border: "1px solid white",
              borderRadius: "50%",
              cursor: "s-resize",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleResizeStart(e, "bottom")}
          />
          <div
            style={{
              position: "absolute",
              left: "-4px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "8px",
              height: "8px",
              backgroundColor: "#007acc",
              border: "1px solid white",
              borderRadius: "50%",
              cursor: "w-resize",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleResizeStart(e, "left")}
          />
          <div
            style={{
              position: "absolute",
              right: "-4px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "8px",
              height: "8px",
              backgroundColor: "#007acc",
              border: "1px solid white",
              borderRadius: "50%",
              cursor: "e-resize",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleResizeStart(e, "right")}
          />
        </>
      )}
    </div>
  );
}

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;
  __altText: string;
  __width?: number;
  __height?: number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  constructor(src: string, altText: string, width?: number, height?: number, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("div");
    div.style.display = "inline-block";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  setWidthAndHeight(width?: number, height?: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  static importJSON(serializedNode: any): ImageNode {
    const { altText, height, width, src } = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      src,
      width,
    });
    return node;
  }

  exportJSON() {
    return {
      altText: this.getAltText(),
      height: this.__height,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width,
    };
  }

  decorate(): React.JSX.Element {
    return (
      <ImageWrapper
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
      />
    );
  }
}

function ImageWrapper({
  src,
  altText,
  width,
  height,
  nodeKey,
}: {
  src: string;
  altText: string;
  width?: number;
  height?: number;
  nodeKey: NodeKey;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <ImageComponent
      src={src}
      altText={altText}
      width={width}
      height={height}
      nodeKey={nodeKey}
      editor={editor}
    />
  );
}

export function $createImageNode({ altText, height, src, width, key }: ImagePayload): ImageNode {
  return new ImageNode(src, altText, width, height, key);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}

type Editor = {
  onSave: (content: string) => unknown;
};

function ImagePlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagePlugin: ImageNode not registered on editor");
    }

    return editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $isElementNode(anchorNode)
            ? anchorNode
            : anchorNode.getTopLevelElement() || anchorNode;

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isHeadingNode(element)) {
          const tag = element.getTag();
          setBlockType(tag);
        } else {
          setBlockType("paragraph");
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  const formatText = (format: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingType: "h1" | "h2" | "h3" | "paragraph") => {
    if (headingType === "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingType));
        }
      });
    }
  };

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            altText: file.name,
            src,
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div
      className="toolbar"
      style={{
        display: "flex",
        gap: "8px",
        padding: "8px",
        borderBottom: "1px solid #ccc",
        backgroundColor: "#f5f5f5",
        flexWrap: "wrap",
      }}
    >
      {/* Text Formatting */}
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={() => formatText("bold")}
          className={`toolbar-item ${isBold ? "active" : ""}`}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            backgroundColor: isBold ? "#007acc" : "#fff",
            color: isBold ? "#fff" : "#000",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          B
        </button>
        <button
          onClick={() => formatText("italic")}
          className={`toolbar-item ${isItalic ? "active" : ""}`}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            backgroundColor: isItalic ? "#007acc" : "#fff",
            color: isItalic ? "#fff" : "#000",
            borderRadius: "4px",
            cursor: "pointer",
            fontStyle: "italic",
          }}
        >
          I
        </button>
        <button
          onClick={() => formatText("underline")}
          className={`toolbar-item ${isUnderline ? "active" : ""}`}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            backgroundColor: isUnderline ? "#007acc" : "#fff",
            color: isUnderline ? "#fff" : "#000",
            borderRadius: "4px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          U
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "1px",
          backgroundColor: "#ccc",
          margin: "4px 0",
        }}
      />

      {/* Headings */}
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={() => formatHeading("h1")}
          className={`toolbar-item ${blockType === "h1" ? "active" : ""}`}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            backgroundColor: blockType === "h1" ? "#007acc" : "#fff",
            color: blockType === "h1" ? "#fff" : "#000",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          H1
        </button>
        <button
          onClick={() => formatHeading("h2")}
          className={`toolbar-item ${blockType === "h2" ? "active" : ""}`}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            backgroundColor: blockType === "h2" ? "#007acc" : "#fff",
            color: blockType === "h2" ? "#fff" : "#000",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          H2
        </button>
        <button
          onClick={() => formatHeading("h3")}
          className={`toolbar-item ${blockType === "h3" ? "active" : ""}`}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            backgroundColor: blockType === "h3" ? "#007acc" : "#fff",
            color: blockType === "h3" ? "#fff" : "#000",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          H3
        </button>
        <button
          onClick={() => formatHeading("paragraph")}
          className={`toolbar-item ${blockType === "paragraph" ? "active" : ""}`}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            backgroundColor: blockType === "paragraph" ? "#007acc" : "#fff",
            color: blockType === "paragraph" ? "#fff" : "#000",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          P
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "1px",
          backgroundColor: "#ccc",
          margin: "4px 0",
        }}
      />

      {/* Media */}
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={insertImage}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          📷 Image
        </button>
      </div>
    </div>
  );
}

function SavePlugin({ onSave }: { onSave: (content: string) => unknown }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        editor.update(() => {
          const root = $getRoot();
          const content = root.getTextContent();
          onSave(content);
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editor, onSave]);

  return null;
}

export default function Editor({ onSave }: Editor) {
  const initialConfig = {
    namespace: "Editor",
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
      ImageNode,
    ],
    theme: {
      text: {
        bold: "editor-text-bold",
        italic: "editor-text-italic",
        underline: "editor-text-underline",
        strikethrough: "editor-text-strikethrough",
        subscript: "editor-text-subscript",
        superscript: "editor-text-superscript",
        code: "editor-text-code",
      },
      paragraph: "editor-paragraph",
      quote: "editor-quote",
      heading: {
        h1: "editor-heading-h1",
        h2: "editor-heading-h2",
        h3: "editor-heading-h3",
        h4: "editor-heading-h4",
        h5: "editor-heading-h5",
        h6: "editor-heading-h6",
      },
      list: {
        nested: {
          listitem: "editor-nested-listitem",
        },
        ol: "editor-list-ol",
        ul: "editor-list-ul",
        listitem: "editor-listitem",
      },
      code: "editor-code",
      codeHighlight: {
        atrule: "editor-tokenAttr",
        attr: "editor-tokenAttr",
        boolean: "editor-tokenProperty",
        builtin: "editor-tokenSelector",
        cdata: "editor-tokenComment",
        char: "editor-tokenSelector",
        class: "editor-tokenFunction",
        "class-name": "editor-tokenFunction",
        comment: "editor-tokenComment",
        constant: "editor-tokenProperty",
        deleted: "editor-tokenProperty",
        doctype: "editor-tokenComment",
        entity: "editor-tokenOperator",
        function: "editor-tokenFunction",
        important: "editor-tokenVariable",
        inserted: "editor-tokenSelector",
        keyword: "editor-tokenAttr",
        namespace: "editor-tokenVariable",
        number: "editor-tokenProperty",
        operator: "editor-tokenOperator",
        prolog: "editor-tokenComment",
        property: "editor-tokenProperty",
        punctuation: "editor-tokenPunctuation",
        regex: "editor-tokenVariable",
        selector: "editor-tokenSelector",
        string: "editor-tokenSelector",
        symbol: "editor-tokenProperty",
        tag: "editor-tokenProperty",
        url: "editor-tokenOperator",
        variable: "editor-tokenVariable",
      },
    },
    onError: (error: Error) => {
      console.error(error);
    },
  };

  // Inject CSS styles
  useEffect(() => {
    const styleId = "lexical-editor-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .editor-text-bold {
          font-weight: bold;
        }
        .editor-text-italic {
          font-style: italic;
        }
        .editor-text-underline {
          text-decoration: underline;
        }
        .editor-text-strikethrough {
          text-decoration: line-through;
        }
        .editor-text-subscript {
          font-size: 0.8em;
          vertical-align: sub !important;
        }
        .editor-text-superscript {
          font-size: 0.8em;
          vertical-align: super;
        }
        .editor-text-code {
          background-color: rgb(240, 242, 245);
          padding: 1px 0.25rem;
          font-family: Menlo, Consolas, Monaco, monospace;
          font-size: 94%;
        }
        .editor-heading-h1 {
          font-size: 24px;
          color: rgb(5, 5, 5);
          font-weight: 400;
          margin: 0;
        }
        .editor-heading-h2 {
          font-size: 15px;
          color: rgb(101, 103, 107);
          font-weight: 700;
          margin: 0;
          text-transform: uppercase;
        }
        .editor-quote {
          margin: 0;
          margin-left: 20px;
          font-size: 15px;
          color: rgb(101, 103, 107);
          border-left-color: rgb(206, 208, 212);
          border-left-width: 4px;
          border-left-style: solid;
          padding-left: 16px;
        }
        .editor-paragraph {
          margin: 0;
          position: relative;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-inner">
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                style={{
                  minHeight: "200px",
                  padding: "16px",
                  border: "1px solid #ccc",
                  borderTop: "none",
                  borderRadius: "0 0 4px 4px",
                  outline: "none",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  position: "relative",
                }}
              />
            }
            placeholder={
              <div
                className="editor-placeholder"
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  color: "#999",
                  fontSize: "14px",
                  pointerEvents: "none",
                }}
              >
                Start typing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState) => {
              // Optional: You can handle real-time changes here
            }}
          />
          <HistoryPlugin />
          <ImagePlugin />
          <SavePlugin onSave={onSave} />
        </div>
      </LexicalComposer>
    </div>
  );
}
