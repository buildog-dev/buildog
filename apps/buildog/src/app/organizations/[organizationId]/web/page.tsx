"use client";

import * as React from "react";
import SimplicityHeader from "@/components/themes/simplicity-header";
import TealHeader from "@/components/themes/teal-header";
import CyanHeader from "@/components/themes/cyan-header";

import { Button } from "@ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";

export default function DropdownMenuCheckboxes() {
  const [header, setHeader] = React.useState<string>("1");

  const test = (idx: string) => {
    switch (idx) {
      case "1":
        return <SimplicityHeader />;
      case "2":
        return <TealHeader />;
      case "3":
        return <CyanHeader />;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4 h-full">
      <div className="w-[200px] rounded-lg p-4 border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-slate-800 text-white" variant="outline">
              Welcome To Buildog
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Choose the Header You Want</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={header === "1"}
              onCheckedChange={() => setHeader("1")}
              className="cursor-pointer"
            >
              Do you prefer simplicity?
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={header === "2"}
              onCheckedChange={() => setHeader("2")}
              className="cursor-pointer"
            >
              Perhaps river?
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={header === "3"}
              onCheckedChange={() => setHeader("3")}
              className="cursor-pointer"
            >
              Or do you prefer the sea?
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full rounded-lg p-4 border">{test(header)}</div>
    </div>
  );
}
