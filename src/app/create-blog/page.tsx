"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import DragDropList, { Item } from "@/components/drag-drop-list";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import remarkGfm from "remark-gfm";

export default function Page() {
  const [cards, setCards] = useState<Item[]>([]);

  function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  useEffect(() => {
    console.log(cards)
  }, [cards])

  const addMarkdownArea = () => {
    setCards((prevCards) => {
      return [
        ...prevCards,
        {
          id: create_UUID(),
          value: ""
        }
      ]
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end w-full h-12">
        <Button>Save</Button>
      </div>
      <div className="flex gap-6">
        <div className="w-full space-y-4">
          <div className="max-h-[calc(100vh_-_116px)] h-[calc(100%_-_46px)] overflow-y-auto p-4 border rounded-lg space-y-4">
            <DndProvider backend={HTML5Backend}>
              <DragDropList cards={cards} setCards={setCards} />
            </DndProvider>
          </div>
          <Button onClick={addMarkdownArea} size="sm" className="w-full">Add Markdown Area</Button>
        </div>
        <div className="w-full h-[calc(100vh_-_116px)] overflow-y-auto p-4 border rounded-lg">
          <article className="prose dark:prose-invert">
            <Markdown remarkPlugins={[remarkGfm]}>
              {cards?.map((item) => item.value + "\n\n").join("")}
            </Markdown>
          </article>
        </div>
      </div>
    </div>
  );
}
