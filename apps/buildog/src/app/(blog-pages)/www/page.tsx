"use client";

import React, { useState } from "react";
import { HTabs, HTabsContent, HTabsList, HTabsTrigger } from "@ui/components/ui/tabs-horizontal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/ui/tabs";
import { Input } from "@ui/components/input";
import { Textarea } from "@ui/components/textarea";
import { Button } from "@ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/dialog";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function page() {
  const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div>
        <nav className="flex justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>

          <ul className="flex gap-4">
            <li>Home</li>
            <li>Blog</li>
            <li>About</li>
          </ul>
        </nav>
        <div className="mt-4">{children}</div>
      </div>
    );
  };

  const Pages = () => {
    const [welcomeText, setWelcomeText] = useState<string>();
    return (
      <>
        <Tabs defaultValue="account" className="w-full">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Preview & Save</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[705px]">
                <DialogHeader>
                  <DialogTitle>Preview</DialogTitle>
                </DialogHeader>
                <div className="h-[500px] overflow-y-auto w-full p-5 border rounded-lg space-y-4">
                  <Layout>
                    <article className="prose dark:prose-invert text-center py-10">
                      <Markdown remarkPlugins={[remarkGfm]}>{welcomeText}</Markdown>
                    </article>
                  </Layout>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button className="w-full" variant="destructive">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="home" className="w-full rounded py-10">
            <Layout>
              <Textarea onChange={(e) => setWelcomeText(e.target.value)} value={welcomeText} />
            </Layout>
          </TabsContent>
          <TabsContent value="blog">
            <Layout>
              <Input />
            </Layout>
          </TabsContent>
          <TabsContent value="about">
            <Layout>
              <Input />
            </Layout>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  const Themes = () => {
    return <>Themes</>;
  };

  return (
    <div>
      <HTabs defaultValue="account" className="flex gap-5 w-full">
        <HTabsList className="w-[300px] h-fit">
          <HTabsTrigger value="pages">Pages</HTabsTrigger>
          <HTabsTrigger value="themes">Themes</HTabsTrigger>
        </HTabsList>

        <HTabsContent value="pages" className="w-full">
          <Pages />
        </HTabsContent>
        <HTabsContent value="themes">
          <Themes />
        </HTabsContent>
      </HTabs>
    </div>
  );
}
