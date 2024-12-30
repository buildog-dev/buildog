"use client";

import React, { useState } from "react";
import { Button } from "@ui/components/button";
import { DataTable } from "@ui/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";

import { Badge } from "@ui/components/ui/badge";

import { CalendarDots, NotePencil, CheckCircle } from "@ui/components/react-icons";

// Define the Blog type
type Blog = {
  cards: {
    id: string;
    value: string;
    lock: boolean;
  }[];
  id: number;
  title: string;
  filename: string;
  text: string;
  status: string;
  tags: string[];
  slug?: string;
};

// Sample data
const dummyBlogs: Blog[] = [
  {
    cards: [
      { id: "card1", value: "Card 1 content", lock: false },
      { id: "card2", value: "Card 2 content", lock: true },
    ],
    id: 1,
    title: "My first blog",
    filename: "blog1.md",
    text: "This is the text content for blog 1. It provides details about the blog post, discussing its main topics and giving an overview of what the user can expect when reading the full article.",
    status: "Published",
    tags: ["React", "JavaScript", "Web Development"],
  },
  {
    cards: [
      { id: "card3", value: "Card 3 content", lock: false },
      { id: "card4", value: "Card 4 content", lock: true },
    ],
    id: 2,
    title: "My third blog",
    filename: "blog2.md",
    text: "This article delves into the core aspects of web development with React, exploring the framework's features, best practices, and common pitfalls. It offers a comprehensive guide to mastering React, complete with examples and tips to enhance your coding skills and build robust applications.",
    status: "Draft",
    tags: ["Draft", "Planning", "Concept"],
  },
  {
    cards: [
      { id: "card5", value: "Card 5 content", lock: false },
      { id: "card6", value: "Card 6 content", lock: true },
    ],
    id: 3,
    title: "My second blog",
    filename: "blog3.md",
    text: "In this post, we examine the fundamentals of JavaScript and its role in modern web development. From basic syntax to advanced techniques, this guide covers essential concepts and provides practical advice for writing clean, efficient code and leveraging JavaScript's full potential.",
    status: "Scheduled",
    tags: ["Archiving", "Content Management", "Best Practices"],
  },
];

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>(dummyBlogs);
  const [open, setOpen] = useState(false);

  const deleteBlog = (blogId: number) => {
    setOpen(!open);

    setBlogs((prevBlogs) => {
      const updatedBlogs = prevBlogs.filter((blog) => blog.id !== blogId);
      return updatedBlogs;
    });
  };

  const tableData = () => {
    return blogs.map((blog) => {
      // Generate tag badges
      const tagsBadges = blog.tags.map((tag) => (
        <Badge
          key={tag}
          className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
          variant="outline"
        >
          {tag}
        </Badge>
      ));

      // Map status to icons
      const getStatusIcon = (status: string) => {
        switch (status) {
          case "Scheduled":
            return <CalendarDots className="w-4 h-4" />;
          case "Draft":
            return <NotePencil className="w-4 h-4" />;
          case "Published":
            return <CheckCircle className="w-4 h-4" />;
          default:
            return null;
        }
      };

      return {
        id: blog.id,
        title: blog.title,
        tags: (
          <div className="flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap">{tagsBadges}</div>
        ),
        status: (
          <div className="flex items-center space-x-2">
            {getStatusIcon(blog.status)}
            <span>{blog.status}</span>
          </div>
        ),
        preview: (
          <div className="flex items-start mb-2 max-w-[70%] overflow-hidden">
            <p className="flex-1 ml-2 truncate">{`${blog.text.slice(0, 100)}...`}</p>
          </div>
        ),
      };
    });
  };

  const columns = [
    {
      id: "title",
      accessorKey: "title",
      header: "Title",
      enableSorting: true,
    },
    {
      accessorKey: "tags",
      header: "Tags",
      enableSorting: false,
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
      accessorKey: "preview",
      header: "Preview",
      enableSorting: false,
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => {
        const blogId = row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                ...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  deleteBlog(blogId);
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
      <DataTable columns={columns} data={tableData()} filterColumnId={"title"} />
    </div>
  );
}
