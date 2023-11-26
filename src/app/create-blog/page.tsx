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
import PreviewBlog from "../preview-blog/page";

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
            <Dialog.Overlay className="fixed inset-0 bg-black-a9 rounded-[6px]  shadow-2xl" />
            <Dialog.Content className="overflow-scroll bg-white rounded-[6px] shadow-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] p-25">
              <PreviewBlog cards={cards} setModalIsOpen={setModalIsOpen} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
