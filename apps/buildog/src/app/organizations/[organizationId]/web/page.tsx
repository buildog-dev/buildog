"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import WebPageTheme from "@/components/web-page-theme";
import WebBlogTheme from "@/components/web-blog-theme";

export default function Page() {
  return (
    <Tabs defaultValue="web">
      <div className="border-b pb-4 w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
          <TabsTrigger value="web">Web</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
        </TabsList>
      </div>

      <div>
        <TabsContent value="web">
          <WebPageTheme />
        </TabsContent>
        <TabsContent value="blog">
          <WebBlogTheme />
        </TabsContent>
      </div>
    </Tabs>
  );
}
