"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import DragDropList, { Item } from "@/components/drag-drop-list";
import remarkGfm from "remark-gfm";
import { create_UUID } from "@/lib/uuid";

import { useSearchParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

interface PreviewBlogProps {
  cards: Item[];
  filename: string | undefined;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PreviewBlog({
  cards,
  filename,
  setModalIsOpen,
}: PreviewBlogProps) {
  console.log(filename);

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
    <div>
      <div className=" m-4 flex flex-col gap-4">
        <Dialog.Title className="font-bold">Preview</Dialog.Title>
        <div className="overflow-y-auto w-full p-5 border rounded-lg space-y-4  ">
          <article className="prose dark:prose-invert">
            <Markdown remarkPlugins={[remarkGfm]}>
              {cards?.map((item) => item.value + "\n\n").join("")}
            </Markdown>
          </article>
        </div>
        <div className="flex flex-row justify-around gap-2">
          <Button
            variant="destructive"
            className="w-full "
            onClick={() => setModalIsOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="default" className="w-full" onClick={save}>
            Preview & Save
          </Button>
        </div>
      </div>
    </div>
  );
}
