"use client";

import React, { useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Textarea } from "@ui/components/textarea";
import { Label } from "@ui/components/label";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/ui/tabs";

import remarkGfm from "remark-gfm";

export default function Page() {
  const [filename, setFilename] = useState<string>();
  const [tab, setTab] = useState<string>("split");
  const [markdownContent, setMarkdownContent] = useState<string>("");

  const filenameHandler = (e) => {
    setFilename(e.target.value);
  };

  const tabChangeHandler = (value) => {
    setTab(value);
    console.log(value);
  };
  const markdownInputHandler = (e) => {
    setMarkdownContent(e.target.value);
  };

  const save = () => {
    if (filename && markdownContent.length > 0) {
      const currentLocalStorage = JSON.parse(localStorage.getItem("blogs") as string);

      const newLocalStorage = {
        ...currentLocalStorage,
        [filename]: { filename, markdownContent },
      };

      localStorage.setItem("blogs", JSON.stringify(newLocalStorage));
    } else {
      // error message
    }
  };

  return (
    <>
      <div className="flex gap-5 mb-5">
        <div className="w-full">
          {tab == "editor" ? (
            <Textarea
              id="markdownContent"
              className="h-96"
              onInput={markdownInputHandler}
              value={markdownContent}
              placeholder="Enter your blog content"
            />
          ) : tab == "preview" ? (
            <Markdown
              className="w-full h-full border rounded-md py-1 px-2"
              remarkPlugins={[remarkGfm]}
            >
              {markdownContent}
            </Markdown>
          ) : (
            <div className="flex gap-5 h-96">
              <Textarea
                id="markdownContent"
                className="h-96 w-full"
                onInput={markdownInputHandler}
                value={markdownContent}
                placeholder="Enter your blog content"
              />
              <Markdown className="w-full border rounded-md py-1 px-2" remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </Markdown>
            </div>
          )}
        </div>
        <div className="space-y-5">
          <div className="">
            <Label htmlFor="markdownContent">Filename</Label>
            <Input onInput={filenameHandler} placeholder="Enter Filename" />
          </div>
          <div>
            <Label className="">Markdown</Label>
            <Tabs value={tab} onValueChange={tabChangeHandler} className="w-full mx-auto">
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="split">Split</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      <Button onClick={() => save()}>Save</Button>
    </>
  );
}
