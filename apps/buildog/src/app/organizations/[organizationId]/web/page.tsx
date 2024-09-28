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
import DefaultCard from "@/components/cards/default-card";
import RichCard from "@/components/cards/feature-rich-card";
import ImageCard from "@/components/cards/image-card";
import DefaultFooter from "@/components/footers/default-footer";
import LinksCenterFooter from "@/components/footers/links-center-footer";
import EnhancedFooter from "@/components/footers/enhanced-footer";

export default function DropdownMenuCheckboxes() {
  const [header, setHeader] = useState<string>("DefaultHeader");
  const [card, setCard] = useState<string>("DefaultCard");
  const [footer, setFooter] = useState<string>("DefaultFooter");

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
              Default Header
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={header === "LinksCenterHeader"}
              onCheckedChange={() => setHeader("LinksCenterHeader")}
              className="cursor-pointer"
            >
              Links Center Header
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={header === "NameCenterHeader"}
              onCheckedChange={() => setHeader("NameCenterHeader")}
              className="cursor-pointer"
            >
              Name Center Header
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-slate-800 text-white" variant="outline">
                Choose Blog Card
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select a Blog Card</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={card === "DefaultCard"}
                onCheckedChange={() => setCard("DefaultCard")}
                className="cursor-pointer"
              >
                Default Blog Card
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={card === "RichCard"}
                onCheckedChange={() => setCard("RichCard")}
                className="cursor-pointer"
              >
                Rich Blog Card
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={card === "ImageCard"}
                onCheckedChange={() => setCard("ImageCard")}
                className="cursor-pointer"
              >
                Image Card
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-slate-800 text-white" variant="outline">
                Choose Footer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select a Footer</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={footer === "DefaultFooter"}
                onCheckedChange={() => setFooter("DefaultFooter")}
                className="cursor-pointer"
              >
                Default Footer
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={footer === "LinksCenterFooter"}
                onCheckedChange={() => setFooter("LinksCenterFooter")}
                className="cursor-pointer"
              >
                Social Links Center
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={footer === "EnhancedFooter"}
                onCheckedChange={() => setFooter("EnhancedFooter")}
                className="cursor-pointer"
              >
                Enhanced Footer
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full rounded-lg p-4 border">
        {/* Header rendering */}
        {header === "DefaultHeader" && <DefaultHeader />}
        {header === "LinksCenterHeader" && <LinksCenterHeader />}
        {header === "NameCenterHeader" && <NameCenterHeader />}

        {/* Blog card rendering */}
        <div className="mt-8">
          {card === "DefaultCard" && <DefaultCard />}
          {card === "RichCard" && <RichCard />}
          {card === "ImageCard" && <ImageCard />}
        </div>
        {/* Footer rendering */}
        <div className="mt-8">
          {footer === "DefaultFooter" && <DefaultFooter />}
          {footer === "LinksCenterFooter" && <LinksCenterFooter />}
          {footer === "EnhancedFooter" && <EnhancedFooter />}
        </div>
      </div>
    </div>
  );
}
