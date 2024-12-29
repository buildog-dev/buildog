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
  const [selectionStyles, setSelectionStyles] = useState<SelectionStyle[]>([]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  useEffect(() => {
    console.log("selectionStyles", selectionStyles);
  }, [selectionStyles]);

  useEffect(() => {
    if (editorRef.current) {
      const content = editorRef.current.textContent || "";
      let styledContent = "";
      let lastIndex = 0;

      // Sort selectionStyles by start position
      const sortedSelectionStyles = [...selectionStyles].sort((a, b) => a.start - b.start);

      sortedSelectionStyles.forEach(({ start, end, types }) => {
        styledContent += content.slice(lastIndex, start);
        let styledText = content.slice(start, end);
        types.forEach((type) => {
          styledText = `<${type}>${styledText}</${type}>`;
        });
        styledContent += styledText;
        lastIndex = end;
      });

      styledContent += content.slice(lastIndex);
      editorRef.current.innerHTML = styledContent;
    }
  }, [selectionStyles]);

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

    setSelectionStyles((prevStyles) => {
      const overlappingRanges = prevStyles.filter(
        (range) => range.start <= end && range.end >= start
      );

      const newStyledRanges = prevStyles.filter(
        (range) => !(range.start <= end && range.end >= start)
      );

      const hasFormat = overlappingRanges.some((range) => range.types.includes(format));

      overlappingRanges.forEach((range) => {
        if (range.start < start && range.end > end) {
          newStyledRanges.push({ start: range.start, end: start, types: range.types });
          newStyledRanges.push({
            start,
            end,
            types: hasFormat
              ? range.types.filter((type) => type !== format)
              : range.types.includes(format)
                ? range.types
                : [...range.types, format],
          });
          newStyledRanges.push({ start: end, end: range.end, types: range.types });
        } else {
          if (range.start < start) {
            newStyledRanges.push({ start: range.start, end: start, types: range.types });
          }
          if (range.end > end) {
            newStyledRanges.push({ start: end, end: range.end, types: range.types });
          }
          const newRange = {
            start: Math.max(start, range.start),
            end: Math.min(end, range.end),
            types: hasFormat
              ? range.types.filter((type) => type !== format)
              : range.types.includes(format)
                ? range.types
                : [...range.types, format],
          };
          if (newRange.start < newRange.end) {
            newStyledRanges.push(newRange);
          }
        }
      });

      if (overlappingRanges.length === 0) {
        newStyledRanges.push({ start, end, types: [format] });
      }

      return newStyledRanges;
    });
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
          styles.push({
            start: startOffset,
            end: totalOffset,
            types: [
              ...(element.parentElement
                ? styles.find((s) => s.start === startOffset && s.end === totalOffset)?.types || []
                : []),
              element.tagName.toLowerCase(),
            ],
          });
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
