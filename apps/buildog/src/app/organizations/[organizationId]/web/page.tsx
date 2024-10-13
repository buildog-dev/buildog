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
import DateCard from "@/components/cards/date-card";
import ImageCard from "@/components/cards/image-card";
import DefaultFooter from "@/components/footers/default-footer";
import EnhancedFooter from "@/components/footers/enhanced-footer";
import LinksCenterFooter from "@/components/footers/links-center-footer";

export default function Page() {
  const [header, setHeader] = useState<string>("DefaultHeader");
  const [card, setCard] = useState<string>("DefaultCard");
  const [footer, setFooter] = useState<string>("DefaultFooter");
  const headers = [
    { name: "DefaultHeader", component: <DefaultHeader /> },
    { name: "LinksCenterHeader", component: <LinksCenterHeader /> },
    { name: "NameCenterHeader", component: <NameCenterHeader /> },
  ];

  const cards = [
    { name: "DefaultCard", component: <DefaultCard /> },
    { name: "DateCard", component: <DateCard /> },
    { name: "ImageCard", component: <ImageCard /> },
  ];

  const footers = [
    { name: "DefaultFooter", component: <DefaultFooter /> },
    { name: "EnhancedFooter", component: <EnhancedFooter /> },
    { name: "LinksCenterFooter", component: <LinksCenterFooter /> },
  ];

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
            {headers.map(({ name }) => (
              <DropdownMenuCheckboxItem
                key={name}
                checked={header === name}
                onCheckedChange={() => setHeader(name)}
                className="cursor-pointer"
              >
                {name.replace(/([A-Z])/g, " $1").trim()}
              </DropdownMenuCheckboxItem>
            ))}
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
              {cards.map(({ name }) => (
                <DropdownMenuCheckboxItem
                  key={name}
                  checked={card === name}
                  onCheckedChange={() => setCard(name)}
                  className="cursor-pointer"
                >
                  {name.replace(/([A-Z])/g, " $1").trim()}
                </DropdownMenuCheckboxItem>
              ))}
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
              {footers.map(({ name }) => (
                <DropdownMenuCheckboxItem
                  key={name}
                  checked={footer === name}
                  onCheckedChange={() => setFooter(name)}
                  className="cursor-pointer"
                >
                  {name.replace(/([A-Z])/g, " $1").trim()}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full rounded-lg p-4 border">
        {renderComponent(headers, header)}

        <div className="mt-8 flex flex-wrap gap-4 p-10">{renderComponent(cards, card)}</div>

        <div className="mt-8">{renderComponent(footers, footer)}</div>
      </div>
    </div>
  );
}
