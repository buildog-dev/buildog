import React, { useState, useCallback, useEffect, useRef } from "react";
import { CardContent } from "@ui/components/ui/card";
import ContentEditable from "./ContentEditable";
import { v4 as uuidv4 } from "uuid";

interface SelectionStyle {
  start: number;
  end: number;
  types: string[];
}

export default function Editor() {
  const [editors, setEditors] = useState([
    { id: uuidv4(), content: "", styles: [] as SelectionStyle[] },
  ]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const editorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    console.log("editors", editors);
  }, [editors]);

  const handleAddEditor = useCallback(
    (currentIndex: number, rightText: string = "", styles: SelectionStyle[] = []) => {
      setEditors((prevEditors) => {
        const newEditor = { id: uuidv4(), content: rightText, styles };
        const updatedEditors = [...prevEditors];
        updatedEditors.splice(currentIndex + 1, 0, newEditor);
        return updatedEditors;
      });
    },
    []
  );

  const handleDeleteEditor = useCallback((id: string) => {
    setEditors((prevEditors) => prevEditors.filter((editor) => editor.id !== id));
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;

    setEditors((prevEditors) => {
      const updatedEditors = [...prevEditors];
      const [movedEditor] = updatedEditors.splice(draggedIndex, 1);
      updatedEditors.splice(index, 0, movedEditor);
      return updatedEditors;
    });

    setDraggedIndex(null);
  };

  const focusUpperComponent = (currentIndex: number) => {
    if (currentIndex > 0 && editorRefs.current[currentIndex - 1]) {
      editorRefs.current[currentIndex - 1]?.focus();
    }
  };

  const focusBottomComponent = (currentIndex: number) => {
    if (currentIndex < editors.length - 1 && editorRefs.current[currentIndex + 1]) {
      editorRefs.current[currentIndex + 1]?.focus();
    }
  };

  return (
    <CardContent className="relative">
      {editors.map((editor, index) => (
        <div
          key={editor.id}
          className="flex items-center"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
        >
          <ContentEditable
            ref={(el: HTMLDivElement | null) => {
              if (el) editorRefs.current[index] = el;
            }}
            content={editor.content}
            styles={editor.styles}
            onContentChange={(newContent, newStyles) => {
              setEditors((prevEditors) => {
                const updatedEditors = [...prevEditors];
                updatedEditors[index].content = newContent;
                updatedEditors[index].styles = newStyles || [];
                return updatedEditors;
              });
            }}
            onAddEditor={(rightText, styles) => handleAddEditor(index, rightText, styles)}
            focusOnMount={index === editors.length - 1}
            focusUpperComponent={() => focusUpperComponent(index)}
            focusBottomComponent={() => focusBottomComponent(index)}
          />
          <button
            className="ml-2 p-1 bg-red-500 text-white rounded"
            onClick={() => handleDeleteEditor(editor.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </CardContent>
  );
}
