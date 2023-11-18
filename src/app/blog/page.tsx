"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Blog = {
  cards: {
    id: string;
    value: string;
    lock: boolean;
  }[];
  filename: string;
  text: string;
};

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>();

  useEffect(() => {
    const localStorageBlogs = JSON.parse(
      localStorage.getItem("blogs") as string
    );
    setBlogs(localStorageBlogs);
  }, []);

  return (
    <div className="space-y-4">
      <Input />
      <div className="grid grid-cols-4 gap-4">
        {blogs ? (
          Object.entries(blogs).map(([key, blog]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{blog.filename}</CardTitle>
                {/* <CardDescription>{blog}</CardDescription> */}
              </CardHeader>
            </Card>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
