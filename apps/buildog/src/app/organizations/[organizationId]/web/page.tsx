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
  const [header, setHeader] = useState<string>("DefaultHeader");

  const selectHeader = (headerType: string) => {
    switch (headerType) {
      case "DefaultHeader":
        return <DefaultHeader />;
      case "LinksCenterHeader":
        return <LinksCenterHeader />;
      case "NameCenterHeader":
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
              checked={header === "DefaultHeader"}
              onCheckedChange={() => setHeader("DefaultHeader")}
              className="cursor-pointer"
            >
              Do you Prefer Simplicity?
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={header === "LinksCenterHeader"}
              onCheckedChange={() => setHeader("LinksCenterHeader")}
              className="cursor-pointer"
            >
              Perhaps Links Center?
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={header === "NameCenterHeader"}
              onCheckedChange={() => setHeader("NameCenterHeader")}
              className="cursor-pointer"
            >
              Or u Prefer Header Center?
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full rounded-lg p-4 border">{selectHeader(header)}</div>
    </div>
  );
}
