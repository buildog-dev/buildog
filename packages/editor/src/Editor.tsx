import React, { useState, useCallback } from "react";
import { CardContent } from "@ui/components/ui/card";
import ContentEditable from "./ContentEditable";
import { v4 as uuidv4 } from "uuid";

export default function Editor() {
  const [editors, setEditors] = useState([{ id: uuidv4() }]);

  const handleAddEditor = useCallback((currentIndex: number) => {
    setEditors((prevEditors) => {
      const newEditor = { id: uuidv4() };
      const updatedEditors = [...prevEditors];
      updatedEditors.splice(currentIndex + 1, 0, newEditor);
      return updatedEditors;
    });
  }, []);

  const handleDeleteEditor = useCallback((id: string) => {
    setEditors((prevEditors) => prevEditors.filter((editor) => editor.id !== id));
  }, []);

  return (
    <CardContent className="relative">
      {editors.map((editor, index) => (
        <div key={editor.id} className="flex items-center">
          <ContentEditable
            isLast={index === editors.length - 1}
            onAddEditor={() => handleAddEditor(index)}
            focusOnMount={index === editors.length - 1}
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
