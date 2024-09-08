"use client";

import * as React from "react";
import DefaultHeader from "@/components/themes/default-header";
import LinksCenterHeader from "@/components/themes/links-center-header";
import NameCenterHeader from "@/components/themes/name-center-header";
import { useState } from "react";
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
  const [header, setHeader] = useState<string>("1");

  const getHeaderComponents = (headerType: string) => {
    switch (headerType) {
      case "1":
        return <DefaultHeader />;
      case "2":
        return <LinksCenterHeader />;
      case "3":
        return <NameCenterHeader />;
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
              Do you Prefer Simplicity?
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={header === "2"}
              onCheckedChange={() => setHeader("2")}
              className="cursor-pointer"
            >
              Perhaps Links Center?
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={header === "3"}
              onCheckedChange={() => setHeader("3")}
              className="cursor-pointer"
            >
              Or u Prefer Header Center?
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full rounded-lg p-4 border">{getHeaderComponents(header)}</div>
    </div>
  );
}
