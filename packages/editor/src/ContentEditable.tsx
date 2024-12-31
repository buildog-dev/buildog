import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Toolbar } from "./Toolbar";
import Editable from "./Editable";

interface ContentEditableProps {
  onAddEditor: (text: string, styles: SelectionStyle[]) => void;
  focusOnMount?: boolean;
  content: string;
  styles: SelectionStyle[];
  tag: keyof JSX.IntrinsicElements;
  onContentChange: (newContent: string, newStyles?: SelectionStyle[]) => void;
  focusUpperComponent: () => void;
  focusBottomComponent: () => void;
  handleDeleteEditor: () => void;
}

interface SelectionStyle {
  start: number;
  end: number;
  types: string[];
}

const ContentEditable = forwardRef<HTMLElement, ContentEditableProps>(
  (
    {
      onAddEditor,
      focusOnMount,
      content,
      styles,
      tag,
      onContentChange,
      focusUpperComponent,
      focusBottomComponent,
      handleDeleteEditor,
    },
    ref
  ) => {
    let editorRef = useRef<HTMLElement>(null);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number }>({
      top: 0,
      left: 0,
    });

    useImperativeHandle(ref, () => editorRef.current as HTMLDivElement);

    const updateDom = (selectionStyle: SelectionStyle[], tag: keyof JSX.IntrinsicElements) => {
      if (editorRef.current) {
        const content = editorRef.current.textContent || "";
        let styledContent = "";
        let lastIndex = 0;

        // Sort selectionStyles by start position
        const sortedSelectionStyles = [...selectionStyle].sort((a, b) => a.start - b.start);

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
    };

    useEffect(() => {
      if (focusOnMount && editorRef.current) {
        editorRef.current.focus();
      }
    }, [focusOnMount]);

    useEffect(() => {
      if (editorRef.current) {
        console.log("content", content);
        editorRef.current.textContent = content;
        updateDom(styles, tag);
      }
    }, [tag]);

    const handleInput = useCallback(() => {
      if (editorRef.current) {
        const newContent = editorRef.current.textContent || "";
        onContentChange(newContent, styles);
      }
    }, [onContentChange]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
          event.preventDefault(); // Prevent default behavior of Enter key

          if (editorRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const endOffset = getTextOffset(
                editorRef.current,
                range.endContainer,
                range.endOffset
              );
              const content = editorRef.current.textContent || "";

              const rightText = content.slice(endOffset);

              const leftTextStyles = styles
                .map((style) => {
                  if (style.start < endOffset && style.end > endOffset) {
                    return { ...style, end: endOffset };
                  }
                  return style;
                })
                .filter((style) => style.end <= endOffset);

              const isSelectionStyle = (style: SelectionStyle | null): style is SelectionStyle => {
                return style !== null;
              };

              const rightTextStyles = styles
                .map((style) => {
                  if (style.start < endOffset && style.end > endOffset) {
                    return { ...style, start: 0, end: style.end - endOffset };
                  } else if (style.start >= endOffset) {
                    return { ...style, start: style.start - endOffset, end: style.end - endOffset };
                  }
                  return null;
                })
                .filter(isSelectionStyle);

              const leftText = content.slice(0, endOffset);
              editorRef.current.textContent = leftText;
              updateDom(leftTextStyles, tag);

              onContentChange(leftText, leftTextStyles);

              onAddEditor(rightText, rightTextStyles);
            }
          }
        } else if (event.key === "ArrowUp") {
          // Logic to focus the upper component
          event.preventDefault();
          focusUpperComponent();
        } else if (event.key === "ArrowDown") {
          // Logic to focus the bottom component
          event.preventDefault();
          focusBottomComponent();
        } else if (event.key === "Backspace" && editorRef.current?.textContent === "") {
          handleDeleteEditor();
        }
      },
      [onAddEditor, onContentChange, styles, focusUpperComponent, focusBottomComponent]
    );

    const updateSelectionStyles = (format: string) => {
      const { start, end } = selection;
      console.log(start, end);
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
          types: hasFormat
            ? range.types.filter((type) => type !== format)
            : [...range.types, format],
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

      updateDom(mergedRanges, tag);
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
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();

        setToolbarPosition({
          top: rect.top - editorRect.top - 40,
          left: rect.left - editorRect.left,
        });

        const start = getTextOffset(editorRef.current, range.startContainer, range.startOffset);
        const end = getTextOffset(editorRef.current, range.endContainer, range.endOffset);

        console.log(start, end);
        setSelection({ start, end });
      }
    }, []);

    const applyTag = (tag: string) => {
      // Store current selection before applying styles
      const savedSelection = {
        start: selection.start,
        end: selection.end,
      };

      updateSelectionStyles(tag);

      // Restore focus and selection
      if (editorRef.current) {
        editorRef.current.focus();

        const windowSelection = window.getSelection();
        const range = document.createRange();

        // Create a new range and set the start and end points
        const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT, null);
        let currentNode;
        let currentOffset = 0;

        // Find start position
        while (walker.nextNode()) {
          currentNode = walker.currentNode;
          const nodeLength = currentNode.textContent?.length || 0;

          if (currentOffset + nodeLength >= savedSelection.start) {
            range.setStart(currentNode, savedSelection.start - currentOffset);
            break;
          }
          currentOffset += nodeLength;
        }

        // Reset for finding end position
        currentOffset = 0;
        walker.currentNode = editorRef.current;

        // Find end position
        while (walker.nextNode()) {
          currentNode = walker.currentNode;
          const nodeLength = currentNode.textContent?.length || 0;

          if (currentOffset + nodeLength >= savedSelection.end) {
            range.setEnd(currentNode, savedSelection.end - currentOffset);
            break;
          }
          currentOffset += nodeLength;
        }

        // Apply the selection
        windowSelection?.removeAllRanges();
        windowSelection?.addRange(range);

        // Update content and styles in the parent component
        const newContent = editorRef.current.textContent || "";
        const newStyles = parseHTMLToSelectionStyles(editorRef.current.innerHTML);
        console.log("newStyles", newStyles);
        onContentChange(newContent, newStyles);
      }
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

    // const createContentEditable = (editableTag: keyof JSX.IntrinsicElements)  => {
    //   const tag = document.createElement(editableTag);
    //   tag.ref = editorRef;
    //   tag.contentEditable = 'true';
    //   tag.className = 'p-0.5 font-mono max-w-none border outline-none dark:text-white';
    //   tag.oninput = handleInput;
    //   tag.onkeydown = handleKeyDown;
    //   tag.onselect = handleSelect;

    //   const parent = document.getElementById('test');
    //   console.log(parent);
    //   parent?.appendChild(tag);
    // }

    return (
      <>
        {selection.start !== selection.end && (
          <Toolbar position={toolbarPosition} onFormat={applyTag} />
        )}
        <Editable
          className={tag === "h1" ? "text-2xl" : ""}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onSelect={handleSelect}
          ref={editorRef as React.Ref<HTMLDivElement>}
          as={tag}
        />
      </>
    );
  }
);

export default ContentEditable;
