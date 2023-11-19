"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import DragDropList, { Item } from "@/components/drag-drop-list";
import remarkGfm from "remark-gfm";
import { create_UUID } from "@/lib/uuid";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

export default function Page() {
  const [filename, setFilename] = useState<string>();
  const [cards, setCards] = useState<Item[]>([]);
  const query = useSearchParams();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

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
        <Button onClick={() => setModalIsOpen(!modalIsOpen)}>
          Preview & Save
        </Button>
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
      <div>
        <Dialog.Root
          open={modalIsOpen}
          onOpenChange={() => setModalIsOpen(!modalIsOpen)}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black-a9" />
            <Dialog.Content className="bg-white rounded-6px shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[450px] max-h-[85vh] p-25">
              <div className=" m-4 flex flex-col gap-4">
                <Dialog.Title className="font-bold">Preview</Dialog.Title>
                <div className="overflow-y-auto w-full p-5 border rounded-lg space-y-4 ">
                  <article className="prose dark:prose-invert">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {cards?.map((item) => item.value + "\n\n").join("")}
                    </Markdown>
                  </article>
                </div>
                <div className="flex flex-row justify-around">
                  <Button onClick={() => setModalIsOpen(false)}>Cancel</Button>
                  <Button onClick={save}>Preview & Save</Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
