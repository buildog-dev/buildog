import React, { useState, useCallback, useEffect, useRef } from "react";
import { CardContent } from "@ui/components/ui/card";
import ContentEditable from "./ContentEditable";
import { v4 as uuidv4 } from "uuid";
import { DotsThreeVertical, Plus } from "@ui/components/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import Option from "./Option";
import CreateNewLine from "./CreateNewLine";

interface SelectionStyle {
  start: number;
  end: number;
  types: string[];
}

export default function Editor() {
  const [editors, setEditors] = useState([
    {
      id: uuidv4(),
      content: "",
      styles: [] as SelectionStyle[],
      tag: "p" as keyof JSX.IntrinsicElements,
    },
  ]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const editorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    console.log("editors", editors);
  }, [editors]);

  const handleAddEditor = useCallback(
    (currentIndex: number, rightText: string = "", styles: SelectionStyle[] = []) => {
      setEditors((prevEditors) => {
        const newEditor = {
          id: uuidv4(),
          content: rightText,
          styles,
          tag: "p" as keyof JSX.IntrinsicElements,
        };
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

  const handleTagChange = (index: number, tag: keyof JSX.IntrinsicElements) => {
    setEditors((prevEditors) => {
      const updatedEditors = [...editors];
      updatedEditors[index].tag = tag;
      return updatedEditors;
    });
  };

  return (
    <div className="relative">
      {editors.map((editor, index) => (
        <div
          key={editor.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          className="group flex items-center"
        >
          <div className="flex gap-1">
            <CreateNewLine handleAddEditor={() => handleAddEditor(index)} />
            <Option handleTagChange={(e) => handleTagChange(index, e)} />
          </div>

          <ContentEditable
            ref={(el: HTMLDivElement | null) => {
              if (el) editorRefs.current[index] = el;
            }}
            content={editor.content}
            styles={editor.styles}
            tag={editor.tag}
            onContentChange={(newContent, newStyles) => {
              setEditors((prevEditors) => {
                const updatedEditors = [...prevEditors];
                updatedEditors[index].content = newContent;
                updatedEditors[index].styles = newStyles || [];
                return updatedEditors;
              });
            }}
            handleDeleteEditor={() => handleDeleteEditor(editor.id)}
            onAddEditor={(rightText, styles) => handleAddEditor(index, rightText, styles)}
            focusOnMount={index === editors.length - 1}
            focusUpperComponent={() => focusUpperComponent(index)}
            focusBottomComponent={() => focusBottomComponent(index)}
          />
        </div>
      ))}
    </div>
  );
}
