"use client";

import React, { useState, useEffect } from "react";
import { Tiptap } from "@repo/editor/src";

import { useParams, useRouter } from "next/navigation";

//import { useAuth } from "@/components/auth-provider";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";

export default function Page() {
  // const { user } = useAuth(); // later if needed
  const params = useParams();
  const router = useRouter();

  const [content, setContent] = useState<any>({
    type: "doc",
    content: [{ type: "paragraph" }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [publishTitle, setPublishTitle] = useState("");

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsPublishDialogOpen(true)}
              className="text-white bg-black dark:text-black dark:bg-white"
              disabled={isLoading}
            >
              Publish
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Publish Blog Post</DialogTitle>
              <DialogDescription>
                Enter a title for your blog post and publish it to make it live.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="publish-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="publish-title"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter blog post title..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPublishDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                //! TODO: implement publish logic here
                disabled={isLoading || !publishTitle.trim()}
                className="text-white bg-black dark:text-black dark:bg-white"
              >
                {isLoading ? "Publishing..." : "Publish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Editor Area */}
        <div className="space-y-4">
          <div>
            <Tiptap content={content} onChange={setContent} autoFocus={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
