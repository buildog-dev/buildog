"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@ui/components/button";
import { DataTable } from "@ui/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";

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
    if (typeof window !== "undefined") {
      const localStorageBlogs = JSON.parse(localStorage.getItem("blogs") as string);
      setBlogs(localStorageBlogs);
    }
  }, []);

  const deleteBlog = (filenameToDelete: string) => {
    setOpen(!open);
    setBlogs((prevBlogs) => {
      const updatedBlogs = { ...prevBlogs };
      delete updatedBlogs[filenameToDelete];
      if (typeof window !== "undefined") {
        localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      }

      return updatedBlogs;
    });
  };

  const tableData = () => {
    return Object.values(blogs || {}).map((blog) => {
      return {
        blogId: "",
        fileName: blog.filename,
        tags: "",
      };
    });
  };

  const columns = [
    {
      id: "fileName",
      accessorKey: "fileName",
      header: "Blog Name",
    },
    {
      accessorKey: "blogId",
      header: "Blog Id",
    },
    {
      accessorKey: "tags",
      header: "Tags",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const fileName = row.original.fileName;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                ...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  deleteBlog(fileName);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={tableData()} filterColumnId={"fileName"} />
    </div>
  );
}
