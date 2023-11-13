"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import DragDropList from "@/components/dragdroplist";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import remarkGfm from "remark-gfm";

export default function Page() {
  const [cards, setCards] = useState([
    {
      id: 1,
      value: "Write a cool JS library",
    },
    {
      id: 2,
      value: "Make it generic enough",
    },
    {
      id: 3,
      value: "Write README",
    },
    {
      id: 4,
      value: "Create some examples",
    },
    {
      id: 5,
      value:
        "Spam in Twitter and IRC to promote it (note that this element is taller than the others)",
    },
    {
      id: 6,
      value: "",
    },
    {
      id: 7,
      value: "PROFIT",
    },
  ]);

  useEffect(() => {
    console.log(cards.map((item) => item.value).join("\n"));
  }, [cards]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end w-full h-12">
        <Button>Save</Button>
      </div>
      <div className="flex gap-6">
        <div className="w-full max-h-[calc(100vh_-_116px)] h-fit overflow-y-auto p-4 border rounded-lg space-y-4">
          <DndProvider backend={HTML5Backend}>
            <DragDropList cards={cards} setCards={setCards} />
          </DndProvider>
        </div>
        <div className="w-full h-[calc(100vh_-_116px)] overflow-y-auto p-4 border rounded-lg">
          <article className="prose prose-zinc">
            <Markdown remarkPlugins={[remarkGfm]}>
              {cards.map((item) => item.value + "\n\n").join("")}
            </Markdown>
          </article>
        </div>
      </div>
    </div>
  );
}
