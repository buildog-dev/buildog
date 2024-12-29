"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";

interface StyledRange {
  start: number;
  end: number;
  type: ("bold" | "italic" | "underline")[];
}

const markdownToHtml = (markdown: string, styledRanges: StyledRange[]): string => {
  let html = markdown.replace(/\n/g, "<br>");

  styledRanges.sort((a, b) => b.start - a.start);

  for (const range of styledRanges) {
    const before = html.slice(0, range.start);
    const styled = html.slice(range.start, range.end);
    const after = html.slice(range.end);

    let styledHtml = styled;
    for (const type of range.type) {
      switch (type) {
        case "bold":
          styledHtml = `<strong>${styledHtml}</strong>`;
          break;
        case "italic":
          styledHtml = `<em>${styledHtml}</em>`;
          break;
        case "underline":
          styledHtml = `<u>${styledHtml}</u>`;
          break;
      }
    }
    html = `${before}${styledHtml}${after}`;
  }

  return html
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^\* (.*$)/gm, "<li>$1</li>");
};

const htmlToMarkdown = (html: string): { markdown: string; styledRanges: StyledRange[] } => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const styledRanges: StyledRange[] = [];
  let markdown = "";
  let offset = 0;

  const processNode = (node: Node) => {
    console.log("processNode - node", node);
    if (node.nodeType === Node.TEXT_NODE) {
      markdown += node.textContent;
      offset += node.textContent?.length || 0;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      // Handle styling first to get correct offsets
      const start = offset;
      if (["strong", "em", "u"].includes(tagName)) {
        // Process child nodes first to get the full text content
        Array.from(element.childNodes).forEach(processNode);
        const end = offset;
        const type = tagName === "strong" ? "bold" : tagName === "em" ? "italic" : "underline";
        styledRanges.push({ start, end, type: [type as "bold" | "italic" | "underline"] });
        return; // Skip the rest since we've processed children
      }

      console.log("tagName", tagName === "br", element.tagName === "BR");
      if (tagName === "br" || element.tagName === "BR") {
        markdown += "\n";
        offset += 1;
      } else if (tagName === "h1") {
        markdown += "# " + element.textContent + "\n";
        offset += 2 + (element.textContent?.length || 0) + 1;
      } else if (tagName === "h2") {
        markdown += "## " + element.textContent + "\n";
        offset += 3 + (element.textContent?.length || 0) + 1;
      } else if (tagName === "h3") {
        markdown += "### " + element.textContent + "\n";
        offset += 4 + (element.textContent?.length || 0) + 1;
      } else if (tagName === "li") {
        markdown += "* " + element.textContent + "\n";
        offset += 2 + (element.textContent?.length || 0) + 1;
      } else {
        Array.from(element.childNodes).forEach(processNode);
      }
    }
  };

  console.log("tempDiv", tempDiv.childNodes);
  Array.from(tempDiv.childNodes).forEach(processNode);

  return { markdown, styledRanges };
};

export default function Editor() {
  const [content, setContent] = useState("");
  const [styledRanges, setStyledRanges] = useState<StyledRange[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const lastHtmlContent = useRef<string>("");
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      console.log("content", content);
      const newHtml = markdownToHtml(content, styledRanges);
      console.log("newHtml", newHtml);
      if (newHtml !== lastHtmlContent.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          selectionRef.current = {
            start: getTextOffset(editorRef.current, range.startContainer, range.startOffset),
            end: getTextOffset(editorRef.current, range.endContainer, range.endOffset),
          };
        }

        editorRef.current.innerHTML = newHtml;
        lastHtmlContent.current = newHtml;

        if (selectionRef.current) {
          const range = document.createRange();
          const start = findNodeAtOffset(editorRef.current, selectionRef.current.start);
          const end = findNodeAtOffset(editorRef.current, selectionRef.current.end);

          if (start && end) {
            range.setStart(start.node, start.offset);
            range.setEnd(end.node, end.offset);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }
      }
    }
  }, [content, styledRanges]);

  const findNodeAtOffset = (
    root: Node,
    targetOffset: number
  ): { node: Node; offset: number } | null => {
    let currentOffset = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

    while (walker.nextNode()) {
      const nodeLength = walker.currentNode.textContent?.length || 0;
      if (currentOffset + nodeLength >= targetOffset) {
        return {
          node: walker.currentNode,
          offset: targetOffset - currentOffset,
        };
      }
      currentOffset += nodeLength;
    }
    return null;
  };

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const { markdown } = htmlToMarkdown(editorRef.current.innerHTML);
      setContent(markdown);
    }
  }, []);

  const handleSelect = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();

      setToolbarPosition({
        top: rect.top - editorRect.top - 40,
        left: rect.left - editorRect.left,
      });

      const start = getTextOffset(editorRef.current, range.startContainer, range.startOffset);
      const end = getTextOffset(editorRef.current, range.endContainer, range.endOffset);

      setSelection({ start, end });
    }
  }, []);

  const getTextOffset = (root: Node, target: Node, offset: number): number => {
    let totalOffset = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

    while (walker.nextNode()) {
      if (walker.currentNode === target) {
        return totalOffset + offset;
      }
      totalOffset += walker.currentNode.textContent?.length || 0;
    }

    return totalOffset;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action (e.g., form submission)
      const selection = window.getSelection();
      if (editorRef.current && selection) {
        const range = selection.getRangeAt(0);
        range.deleteContents(); // Remove the current selection if any
        const newLine = document.createElement("div"); // Create a new line element
        newLine.innerHTML = "<br>"; // Add a line break
        range.insertNode(newLine); // Insert the new line at the cursor position
        range.setStartAfter(newLine); // Move the cursor to the new line
        range.collapse(true); // Collapse the range to the end point
        selection.removeAllRanges(); // Clear existing selections
        selection.addRange(range); // Set the new range
      }
    }
  };

  const toggleFormatting = (format: "bold" | "italic" | "underline") => {
    const { start, end } = selection;
    console.log("start", start);
    console.log("end", end);
    // Find any existing ranges that overlap with the selection
    const overlappingRanges = styledRanges.filter(
      (range) => range.start <= end && range.end >= start
    );

    const newStyledRanges = styledRanges.filter(
      (range) => !(range.start <= end && range.end >= start)
    );

    // Handle overlapping ranges
    overlappingRanges.forEach((range) => {
      // If range completely contains selection, split into 3 parts
      if (range.start < start && range.end > end) {
        // Left part
        newStyledRanges.push({
          start: range.start,
          end: start,
          type: range.type,
        });
        // Middle part (selection)
        newStyledRanges.push({
          start,
          end,
          type: range.type.includes(format)
            ? range.type.filter((t) => t !== format)
            : [...range.type, format],
        });
        // Right part
        newStyledRanges.push({
          start: end,
          end: range.end,
          type: range.type,
        });
      }
      // If range partially overlaps or is contained within selection
      else {
        if (range.start < start) {
          // Left part
          newStyledRanges.push({
            start: range.start,
            end: start,
            type: range.type,
          });
        }
        if (range.end > end) {
          // Right part
          newStyledRanges.push({
            start: end,
            end: range.end,
            type: range.type,
          });
        }
        // Overlapping part
        newStyledRanges.push({
          start: Math.max(start, range.start),
          end: Math.min(end, range.end),
          type: range.type.includes(format)
            ? range.type.filter((t) => t !== format)
            : [...range.type, format],
        });
      }
    });

    // If no overlapping ranges, add new range
    if (overlappingRanges.length === 0) {
      newStyledRanges.push({ start, end, type: [format] });
    }

    console.log("newStyledRanges", newStyledRanges);
    setStyledRanges(newStyledRanges);
    handleInput();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Markdown Editor</h1>
      <Card>
        <CardContent className="relative">
          <div
            ref={editorRef}
            className="w-full min-h-[calc(100vh-200px)] p-4 font-mono outline-none prose max-w-none"
            contentEditable
            onInput={handleInput}
            onSelect={handleSelect}
            onKeyDown={handleKeyDown}
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
                <Button size="sm" variant="ghost" onClick={() => toggleFormatting("bold")}>
                  B<span className="sr-only">Bold</span>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleFormatting("italic")}>
                  I<span className="sr-only">Italic</span>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleFormatting("underline")}>
                  U<span className="sr-only">Underline</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
