import React, { useEffect, useState } from "react";

// Define types for the Virtual DOM structure
type TextNode = {
  text: string;
  bold: boolean;
  italic: boolean;
  link: string | null;
};

type Block = {
  type: "paragraph";
  children: TextNode[];
};

const initialVirtualDOM: Block[] = [
  {
    type: "paragraph",
    children: [
      { text: "Hello, ", bold: false, italic: false, link: null },
      { text: "this is bold", bold: true, italic: false, link: null },
      { text: " and ", bold: false, italic: false, link: null },
      { text: "italic.", bold: false, italic: true, link: null },
    ],
  },
];

function LL() {
  const [virtualDOM, setVirtualDOM] = useState<Block[]>(initialVirtualDOM);

  useEffect(() => {
    console.log(virtualDOM);
  }, [virtualDOM]);

  const renderNode = (node: TextNode): JSX.Element | string => {
    let content: JSX.Element | string = node.text;

    if (node.bold) content = <strong>{content}</strong>;
    if (node.italic) content = <em>{content}</em>;
    if (node.link) content = <a href={node.link}>{content}</a>;

    return content;
  };

  const renderBlock = (block: Block): JSX.Element => (
    <p>
      {block.children.map((node, index) => (
        <span key={index}>{renderNode(node)}</span>
      ))}
    </p>
  );

  const applyFormatting = (format: keyof TextNode): void => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    let charIndex = 0;
    let startOffset = 0;
    let endOffset = 0;

    const updatedDOM = [...virtualDOM];

    // Iterate through all text nodes and calculate the correct offsets
    updatedDOM.forEach((block) => {
      const newChildren: TextNode[] = [];

      block.children.forEach((node) => {
        const nodeLength = node.text.length;

        // Calculate the start offset
        if (
          startContainer.nodeType === Node.TEXT_NODE &&
          startContainer.textContent === node.text
        ) {
          startOffset = charIndex + range.startOffset;
        }

        // Calculate the end offset
        if (endContainer.nodeType === Node.TEXT_NODE && endContainer.textContent === node.text) {
          endOffset = charIndex + range.endOffset;
        }

        charIndex += nodeLength;
      });
    });

    // Now apply the formatting based on the calculated offsets
    updatedDOM.forEach((block) => {
      const newChildren: TextNode[] = [];
      let charIndex = 0;

      block.children.forEach((node) => {
        const nodeLength = node.text.length;

        if (charIndex + nodeLength <= startOffset || charIndex >= endOffset) {
          newChildren.push(node);
        } else if (charIndex >= startOffset && charIndex + nodeLength <= endOffset) {
          newChildren.push({
            ...node,
            [format]: !node[format],
          });
        } else {
          const before = node.text.slice(0, Math.max(0, startOffset - charIndex));
          const selected = node.text.slice(
            Math.max(0, startOffset - charIndex),
            Math.min(nodeLength, endOffset - charIndex)
          );
          const after = node.text.slice(Math.min(nodeLength, endOffset - charIndex));

          if (before) newChildren.push({ ...node, text: before });
          if (selected) newChildren.push({ ...node, text: selected, [format]: !node[format] });
          if (after) newChildren.push({ ...node, text: after });
        }

        charIndex += nodeLength;
      });

      block.children = newChildren;
    });

    setVirtualDOM(updatedDOM);
  };

  const applyLink = (): void => {
    const url = prompt("Enter the URL:");
    if (!url) return;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    const updatedDOM = [...virtualDOM];

    updatedDOM.forEach((block) => {
      const newChildren: TextNode[] = [];
      let charIndex = 0;

      block.children.forEach((node) => {
        const nodeLength = node.text.length;

        if (charIndex + nodeLength <= startOffset || charIndex >= endOffset) {
          newChildren.push(node);
        } else if (charIndex >= startOffset && charIndex + nodeLength <= endOffset) {
          newChildren.push({
            ...node,
            link: url,
          });
        } else {
          const before = node.text.slice(0, Math.max(0, startOffset - charIndex));
          const selected = node.text.slice(
            Math.max(0, startOffset - charIndex),
            Math.min(nodeLength, endOffset - charIndex)
          );
          const after = node.text.slice(Math.min(nodeLength, endOffset - charIndex));

          if (before) newChildren.push({ ...node, text: before });
          if (selected) newChildren.push({ ...node, text: selected, link: url });
          if (after) newChildren.push({ ...node, text: after });
        }

        charIndex += nodeLength;
      });

      block.children = newChildren;
    });

    setVirtualDOM(updatedDOM);
  };

  return (
    <div className="App">
      <div className="toolbar">
        <button onClick={() => applyFormatting("bold")}>Bold</button>
        <button onClick={() => applyFormatting("italic")}>Italic</button>
        <button onClick={applyLink}>Link</button>
      </div>
      <div contentEditable suppressContentEditableWarning className="editor">
        {virtualDOM.map((block, index) => (
          <div key={index}>{renderBlock(block)}</div>
        ))}
      </div>
    </div>
  );
}

export default LL;
