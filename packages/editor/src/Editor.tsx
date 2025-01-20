"use client";

import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@ui/components/card";
import { Textarea } from "@ui/components/textarea";
import { Button } from "@ui/components/button";
import { parseMarkdown } from "./utils/markdownParser";

type Editor = {
  onSave: (e: unknown) => unknown;
};

export default function Editor({ onSave }: Editor) {
  const [markdown, setMarkdown] = useState(
    "# Hello, **Markdown**!\n\nStart _typing_ here...\n\nUse `inline code` like this."
  );
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleParse = () => {
    const parsed = parseMarkdown(markdown);
    onSave(parsed);
  };

  const handleSelect = () => {
    if (textareaRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const textareaRect = textareaRef.current.getBoundingClientRect();

        setToolbarPosition({
          top: rect.top, // 40px above the selection
          left: rect.left,
        });
      }

      setSelection({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      });
    }
  };

  const applyFormatting = useCallback(
    (format: string) => {
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const selectedText = markdown.substring(start, end);
        let formattedText = "";

        switch (format) {
          case "bold":
            formattedText = `**${selectedText}**`;
            break;
          case "italic":
            formattedText = `_${selectedText}_`;
            break;
          // case 'underline':
          //   formattedText = `<u>${selectedText}</u>`
          //   break
        }

        const newText = markdown.substring(0, start) + formattedText + markdown.substring(end);
        setMarkdown(newText);

        // Reset selection
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(start, end + 4); // 4 is the length of the added markdown syntax
          }
        }, 0);
      }
    },
    [markdown]
  );

  return (
    <div>
      <Textarea
        ref={textareaRef}
        className="w-full h-[calc(100vh-300px)]"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        onSelect={handleSelect}
        placeholder="Type your markdown here..."
      />
      {selection.start !== selection.end && (
        <div
          className="absolute bg-white border rounded shadow-lg p-1"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
          }}
        >
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={() => applyFormatting("bold")}>
              Bold
            </Button>
            <Button size="sm" variant="ghost" onClick={() => applyFormatting("italic")}>
              Italic
            </Button>
            {/* <Button size="sm" variant="ghost" onClick={() => applyFormatting('underline')}>
                    Underline
                  </Button> */}
          </div>
        </div>
      )}
      <div className="mt-4 space-x-2">
        <Button onClick={handleParse}>Save</Button>
      </div>
    </div>
  );
}
