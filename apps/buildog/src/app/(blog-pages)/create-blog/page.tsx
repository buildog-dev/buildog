"use client";

import React, { useState } from "react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/ui/tabs";
import Editor from "./components/editor";
import Preview from "./components/preview";
import { toast } from "@ui/components/use-toast";
import { Badge } from "@ui/components/ui/badge";
export default function Page() {
  const [filename, setFilename] = useState<string>();
  const [tag, setTag] = useState<string>("");
  const [tags, setTagArray] = useState([]);
  const [tab, setTab] = useState<string>("editor");
  const [tagID, setTagID] = useState(0);
  const [markdownContent, setMarkdownContent] = useState<string>("");

  const tagsHandler = () => {
    tags.push({ id: tagID, value: tag });
    setTag("");
    setTagID(tagID + 1);
  };

  const removeTag = (id) => {
    const filteredTags = tags.filter((item) => item.id != id);
    setTagArray(filteredTags);
  };

  const save = () => {
    if (!(filename?.length > 0)) {
      toast({
        title: "Error",
        description: "Filename cannot be empty",
      });
    } else if (!(markdownContent?.length > 0)) {
      toast({
        title: "Error",
        description: "Markdown content cannot be empty",
      });
    } else if (filename && markdownContent.length > 0) {
      const currentLocalStorage = JSON.parse(localStorage.getItem("blogs") as string);

      const newLocalStorage = {
        ...currentLocalStorage,
        [filename]: { filename, markdownContent, tags },
      };
      try {
        localStorage.setItem("blogs", JSON.stringify(newLocalStorage));
        toast({
          title: "Success",
          description: "Blog post has been successfully saved",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occured while saving blog post. Code: " + error,
        });
      }
    }
  };

  return (
    <>
      <div className="flex gap-5 max-h-full">
        <div className="w-full">
          {tab == "editor" ? (
            <Editor content={markdownContent} onInput={(value) => setMarkdownContent(value)} />
          ) : tab == "preview" ? (
            <Preview content={markdownContent} />
          ) : (
            <div className="grid h-full grid-rows-2 gap-6 md:grid-cols-2">
              <Editor content={markdownContent} onInput={(value) => setMarkdownContent(value)} />
              <Preview content={markdownContent} />
            </div>
          )}
        </div>
        <div className="space-y-5">
          <div>
            <Label htmlFor="markdownContent">Filename</Label>
            <Input
              onInput={(e) => {
                setFilename(e.currentTarget.value);
              }}
              placeholder="Enter Filename"
            />
          </div>
          <div>
            <Label className="">Markdown</Label>
            <Tabs
              value={tab}
              onValueChange={(value) => setTab(value)}
              defaultValue="complete"
              className="flex-1"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="editor">
                  <span className="sr-only">Complete</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-5 w-5"
                  >
                    <rect x="4" y="3" width="12" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="4" y="7" width="12" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="4" y="11" width="3" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="4" y="15" width="3" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="8.5" y="11" width="3" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="8.5" y="15" width="3" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="13" y="11" width="3" height="2" rx="1" fill="currentColor"></rect>
                  </svg>
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <span className="sr-only">Insert</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.491 7.769a.888.888 0 0 1 .287.648.888.888 0 0 1-.287.648l-3.916 3.667a1.013 1.013 0 0 1-.692.268c-.26 0-.509-.097-.692-.268L5.275 9.065A.886.886 0 0 1 5 8.42a.889.889 0 0 1 .287-.64c.181-.17.427-.267.683-.269.257-.002.504.09.69.258L8.903 9.87V3.917c0-.243.103-.477.287-.649.183-.171.432-.268.692-.268.26 0 .509.097.692.268a.888.888 0 0 1 .287.649V9.87l2.245-2.102c.183-.172.432-.269.692-.269.26 0 .508.097.692.269Z"
                      fill="currentColor"
                    ></path>
                    <rect x="4" y="15" width="3" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="8.5" y="15" width="3" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="13" y="15" width="3" height="2" rx="1" fill="currentColor"></rect>
                  </svg>
                </TabsTrigger>
                <TabsTrigger value="split">
                  <span className="sr-only">Edit</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-5 w-5"
                  >
                    <rect x="4" y="3" width="12" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="4" y="7" width="12" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="4" y="11" width="3" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="4" y="15" width="4" height="2" rx="1" fill="currentColor"></rect>
                    <rect x="8.5" y="11" width="3" height="2" rx="1" fill="currentColor"></rect>
                    <path
                      d="M17.154 11.346a1.182 1.182 0 0 0-1.671 0L11 15.829V17.5h1.671l4.483-4.483a1.182 1.182 0 0 0 0-1.671Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex gap-5">
            <Input
              placeholder="Enter tag"
              value={tag}
              onInput={(e) => setTag(e.currentTarget.value)}
            />
            <Button onClick={tagsHandler}>+</Button>
          </div>
          <div className="flex flex-wrap gap-2 max-w-[300px]">
            {tags.map((tag) => {
              return (
                <Badge key={tag.id}>
                  {tag.value}
                  <Button
                    className="h-2 w-2 p-2 ml-2"
                    color="primary"
                    onClick={() => {
                      removeTag(tag.id);
                    }}
                  >
                    x
                  </Button>
                </Badge>
              );
            })}
          </div>
          <Button className="w-full" onClick={save}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
