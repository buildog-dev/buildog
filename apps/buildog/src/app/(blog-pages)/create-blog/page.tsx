"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import DragDropList, { Item } from "@/components/drag-drop-list";
import remarkGfm from "remark-gfm";
import { create_UUID } from "@/lib/uuid";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [filename, setFilename] = useState<string>();
  const [cards, setCards] = useState<Item[]>([]);
  const query = useSearchParams();

  useEffect(() => {
    const qsFilename = query.get("filename");
    if (qsFilename) {
      const localStorageBlogs = JSON.parse(
        localStorage.getItem("blogs") as string
      );

      const blog = localStorageBlogs[qsFilename];
      setFilename(blog.filename);
      setCards(blog.cards);
    } else {
      // This is for initial markdown
      addMarkdownArea();
    }
  }, []);

  const addMarkdownArea = () => {
    setCards((prevCards) => {
      return [
        ...prevCards,
        {
          id: create_UUID(),
          value: "",
          lock: false,
        },
      ];
    });
  };

  const save = () => {
    if (filename && cards.length > 0) {
      const text = cards?.map((item) => item.value + "\n\n").join("");

      const currentLocalStorage = JSON.parse(
        localStorage.getItem("blogs") as string
      );

      const newLocalStorage = {
        ...currentLocalStorage,
        [filename]: { cards, filename, text },
      };

      localStorage.setItem("blogs", JSON.stringify(newLocalStorage));
    } else {
      // error message
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between p-2 border rounded-lg w-full">
        <Input
          onChange={(e) => setFilename(e.target.value)}
          value={filename}
          placeholder="Filename"
          className="w-[400px]"
        />
        <Button onClick={save}>Save</Button>
      </div>
      <div className="flex h-full gap-6">
        <div className="w-full space-y-4">
          <div className="w-full p-5 border rounded-lg space-y-4">
            <Button
              onClick={addMarkdownArea}
              size="sm"
              className="text-end"
              variant="secondary"
            >
              Add Markdown Area
            </Button>
            <div className="max-h-[calc(100vh_-_200px)] overflow-y-auto">
              <DragDropList cards={cards} setCards={setCards} />
            </div>
          </div>
        </div>

        <div className="overflow-y-auto w-full p-5 border rounded-lg space-y-4">
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
