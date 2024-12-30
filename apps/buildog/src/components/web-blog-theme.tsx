"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Slider } from "@ui/components/ui/slider";

type FontSize = "small" | "medium" | "large";
type FontFamily = "serif" | "sans-serif" | "monospace";
type Color = string;

interface BlogStyle {
  fontSize: FontSize;
  fontFamily: FontFamily;
  textColor: Color;
  lineHeight: number;
}

export default function WebBlogTheme() {
  const [blogStyle, setBlogStyle] = useState<BlogStyle>({
    fontSize: "medium",
    fontFamily: "serif",
    textColor: "#000000",
    lineHeight: 1.5,
  });

  const previewStyle = {
    fontSize:
      blogStyle.fontSize === "small" ? "14px" : blogStyle.fontSize === "medium" ? "16px" : "18px",
    fontFamily: blogStyle.fontFamily,
    lineHeight: blogStyle.lineHeight,
    color: blogStyle.textColor,
  };

  const updateBlogStyle = (newStyle: Partial<BlogStyle>) => {
    setBlogStyle((prevStyle) => ({ ...prevStyle, ...newStyle }));
  };

  return (
    <div className="flex">
      <div className="shrink-0 w-[300px] min-h-[calc(100vh_-_122px)] space-y-2 p-4 border-r">
        <div>
          <label className="block text-sm font-medium mb-1">Font Size</label>
          <Select
            value={blogStyle.fontSize}
            onValueChange={(value) =>
              updateBlogStyle({ fontSize: value as "small" | "medium" | "large" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Family</label>
          <Select
            value={blogStyle.fontFamily}
            onValueChange={(value) =>
              updateBlogStyle({ fontFamily: value as "serif" | "sans-serif" | "monospace" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="sans-serif">Sans-serif</SelectItem>
              <SelectItem value="monospace">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <input
            type="color"
            value={blogStyle.textColor}
            onChange={(e) => updateBlogStyle({ textColor: e.target.value })}
            className="block w-full h-10 mt-1"
          />
          <input
            type="text"
            value={blogStyle.textColor}
            onChange={(e) => updateBlogStyle({ textColor: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Line Height: {blogStyle.lineHeight}
          </label>
          <Slider
            min={1}
            max={2}
            step={0.1}
            value={[blogStyle.lineHeight]}
            onValueChange={(value) => updateBlogStyle({ lineHeight: value[0] })}
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex-1 p-8 bg-white">
          <h1 className="font-bold mb-4" style={{ ...previewStyle, fontSize: "24px" }}>
            Sample Blog Post
          </h1>
          <div style={previewStyle}>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel
              consectetur interdum, nisl nunc egestas nunc, vitae tincidunt nisl nunc euismod nunc.
            </p>
            <p className="mb-4">
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
