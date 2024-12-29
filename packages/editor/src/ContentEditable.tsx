import React, { useRef, useCallback, useEffect, useState } from "react";

interface ContentEditableProps {
  isLast: boolean;
  onAddEditor: () => void;
  focusOnMount?: boolean;
}

interface SelectionStyle {
  start: number;
  end: number;
  types: string[];
}

const ContentEditable: React.FC<ContentEditableProps> = ({ isLast, onAddEditor, focusOnMount }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const updateDom = (b: any) => {
    if (editorRef.current) {
      const content = editorRef.current.textContent || "";
      let styledContent = "";
      let lastIndex = 0;

      // Sort selectionStyles by start position
      const sortedSelectionStyles = [...b].sort((a, b) => a.start - b.start);

      sortedSelectionStyles.forEach(({ start, end, types }) => {
        styledContent += content.slice(lastIndex, start);
        let styledText = content.slice(start, end);
        types.forEach((type: any) => {
          styledText = `<${type}>${styledText}</${type}>`;
        });
        styledContent += styledText;
        lastIndex = end;
      });

      styledContent += content.slice(lastIndex);
      editorRef.current.innerHTML = styledContent;
    }
  };

  useEffect(() => {
    if (focusOnMount && editorRef.current) {
      editorRef.current.focus();
    }
  }, [focusOnMount]);

  const handleInput = useCallback(() => {
    console.log("handleInput", editorRef.current?.innerHTML);
    // const html = editorRef.current?.innerHTML || "";
    // const styles = parseHTMLToSelectionStyles(html);
    // setSelectionStyles(styles);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      console.log("handleKeyDown", editorRef.current?.innerHTML);
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior of Enter key
        onAddEditor();
      }
    },
    [onAddEditor]
  );

  const updateSelectionStyles = (format: string) => {
    const { start, end } = selection;
    if (!editorRef.current) return;

    const currentStyles = parseHTMLToSelectionStyles(editorRef.current.innerHTML);
    const overlappingRanges = currentStyles.filter(
      (range) => range.start < end && range.end > start
    );

    const newStyledRanges = currentStyles.filter(
      (range) => range.start >= end || range.end <= start
    );

    const hasFormat = overlappingRanges.some((range) => range.types.includes(format));

    overlappingRanges.forEach((range) => {
      if (range.start < start) {
        newStyledRanges.push({ start: range.start, end: start, types: range.types });
      }
      if (range.end > end) {
        newStyledRanges.push({ start: end, end: range.end, types: range.types });
      }
      const newRange = {
        start: Math.max(start, range.start),
        end: Math.min(end, range.end),
        types: hasFormat ? range.types.filter((type) => type !== format) : [...range.types, format],
      };
      if (newRange.start < newRange.end) {
        newStyledRanges.push(newRange);
      }
    });

    if (overlappingRanges.length === 0) {
      newStyledRanges.push({ start, end, types: [format] });
    }

    // Merge consecutive ranges with the same types
    newStyledRanges.sort((a, b) => a.start - b.start);
    const mergedRanges: SelectionStyle[] = [];
    newStyledRanges.forEach((range) => {
      const lastRange = mergedRanges[mergedRanges.length - 1];
      if (
        lastRange &&
        lastRange.end >= range.start &&
        JSON.stringify(lastRange.types) === JSON.stringify(range.types)
      ) {
        lastRange.end = Math.max(lastRange.end, range.end);
      } else {
        mergedRanges.push(range);
      }
    });

    console.log("mergedRanges", mergedRanges);

    updateDom(mergedRanges);
  };

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

  const handleSelect = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      //   const rect = range.getBoundingClientRect();
      //   const editorRect = editorRef.current.getBoundingClientRect();

      const start = getTextOffset(editorRef.current, range.startContainer, range.startOffset);
      const end = getTextOffset(editorRef.current, range.endContainer, range.endOffset);

      setSelection({ start, end });
    }
  }, []);

  const applyTag = (tag: string) => {
    updateSelectionStyles(tag);
  };

  const parseHTMLToSelectionStyles = (html: string) => {
    console.log("parseHTMLToSelectionStyles", html);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const styles: SelectionStyle[] = [];
    let totalOffset = 0;

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        totalOffset += text.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const startOffset = totalOffset;

        // Process child nodes
        Array.from(node.childNodes).forEach((child) => processNode(child));

        // Add style for this element
        if (["B", "I", "U"].includes(element.tagName)) {
          const tagName = element.tagName.toLowerCase();
          const existingStyle = styles.find(
            (s) => s.start === startOffset && s.end === totalOffset
          );

          if (existingStyle) {
            // If range exists, just add the new type if not already present
            if (!existingStyle.types.includes(tagName)) {
              existingStyle.types.push(tagName);
            }
          } else {
            // If range doesn't exist, create new style entry
            styles.push({
              start: startOffset,
              end: totalOffset,
              types: [
                ...(element.parentElement
                  ? styles.find((s) => s.start === startOffset && s.end === totalOffset)?.types ||
                    []
                  : []),
                tagName,
              ],
            });
          }
        }
      }
    };

    Array.from(tempDiv.childNodes).forEach((node) => processNode(node));

    // Sort and merge overlapping styles
    return styles.sort((a, b) => a.start - b.start);
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={() => applyTag("b")}>Bold</button>
        <button onClick={() => applyTag("i")}>Italic</button>
        <button onClick={() => applyTag("u")}>Underline</button>
      </div>
      <div
        ref={isLast ? editorRef : null} // Only the last editor has the ref
        className="w-full min-h-[calc(100vh-200px)] p-4 font-mono outline-none prose max-w-none border"
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default ContentEditable;
