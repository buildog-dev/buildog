import React, { useState, useRef } from "react";

const RichTextEditor: React.FC = () => {
  const [content, setContent] = useState<string>("<p>Type your text here...</p>");
  const editorRef = useRef<HTMLDivElement | null>(null);

  const decideWrapper = (tagName: "bold" | "italic" | "a") => {
    switch (tagName) {
      case "bold":
        return "strong";
      case "italic":
        return "em";
      default:
        return tagName;
    }
  };

  const applyStyle = (tagName: "bold" | "italic" | "a") => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedContent = range.extractContents();

    const wrapper = document.createElement(decideWrapper(tagName));
    if (tagName === "a") {
      const url = prompt("Enter the URL");
      if (url) {
        wrapper.setAttribute("href", url);
        wrapper.setAttribute("target", "_blank");
      } else {
        return; // If no URL is provided, don't apply the link
      }
    }

    wrapper.appendChild(selectedContent);
    range.insertNode(wrapper);

    // Update content state
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const saveContentAsJSON = () => {
    const contentAsJSON = JSON.stringify({ content });
    console.log(contentAsJSON);
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={() => applyStyle("bold")}>Bold</button>
        <button onClick={() => applyStyle("italic")}>Italic</button>
        <button onClick={() => applyStyle("a")}>Link</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleInput}
        style={{
          border: "1px solid #ccc",
          minHeight: "200px",
          padding: "10px",
        }}
      ></div>
      <button onClick={saveContentAsJSON}>Save as JSON</button>
    </div>
  );
};

export default RichTextEditor;
