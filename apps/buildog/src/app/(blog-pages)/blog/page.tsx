"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResetIcon } from '@radix-ui/react-icons'
import { Cross1Icon } from '@radix-ui/react-icons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

type Blog = {
  cards: {
    id: string;
    value: string;
    lock: boolean;
  }[];
  filename: string;
  text: string;
};

type Blogs = {
  [filename: string]: Blog;
};

export default function Page() {
  const [blogs, setBlogs] = useState<Blogs>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const localStorageBlogs = JSON.parse(
      localStorage.getItem("blogs") as string
    );
    setBlogs(localStorageBlogs);
  }, []);

  const deleteBlog = (filenameToDelete: string) => {
    setOpen(!open)
    setBlogs((prevBlogs) => {
      const updatedBlogs = { ...prevBlogs };
      delete updatedBlogs[filenameToDelete];
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      
      return updatedBlogs;
    });
  };
  return (
    <div className="space-y-4">
      <Input />
      <div className="grid grid-cols-4 gap-4">
        {blogs ? (
          Object.entries(blogs).map(([key, blog]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{blog.filename}</CardTitle>
                <Button
                  variant="destructive"
                  className="w-10 ml-auto"
                  onClick={() => setOpen(!open)}
                  size="sm"
                >
                  <Cross1Icon />
                </Button>
                {/* <CardDescription>{blog}</CardDescription> */}
              </CardHeader>
              <Dialog onOpenChange={setOpen} open={open}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Blog</DialogTitle>

                    <DialogDescription>
                      Are you sure for delete this blog?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(!open)}>
                      No
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteBlog(blog.filename)}
                    >
                      Yes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
