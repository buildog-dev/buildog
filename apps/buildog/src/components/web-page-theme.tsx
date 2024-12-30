import React, { useState } from "react";
import DefaultHeader from "./themes/default-header";
import LinksCenterHeader from "./themes/links-center-header";
import NameCenterHeader from "./themes/name-center-header";
import DefaultCard from "./cards/default-card";
import DateCard from "./cards/date-card";
import ImageCard from "./cards/image-card";
import DefaultFooter from "./footers/default-footer";
import EnhancedFooter from "./footers/enhanced-footer";
import LinksCenterFooter from "./footers/links-center-footer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Button } from "@ui/components/button";

export default function WebPageTheme() {
  const [header, setHeader] = useState<string>("DefaultHeader");
  const [card, setCard] = useState<string>("DefaultCard");
  const [footer, setFooter] = useState<string>("DefaultFooter");

  const renderCards = (Component: React.ComponentType, count: number) => {
    const cards = [];
    for (let index = 0; index < count; index++) {
      cards.push(<Component key={index} />);
    }
    return cards;
  };

  return (
    <div className="flex">
      <div className="shrink-0 w-[300px] min-h-[calc(100vh_-_52px)] space-y-2 p-2 border-r">
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
                checked={card === "DateCard"}
                onCheckedChange={() => setCard("DateCard")}
                className="cursor-pointer"
              >
                Blog Card With Date
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
                checked={footer === "EnhancedFooter"}
                onCheckedChange={() => setFooter("EnhancedFooter")}
                className="cursor-pointer"
              >
                Enhanced Footer
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={footer === "LinksCenterFooter"}
                onCheckedChange={() => setFooter("LinksCenterFooter")}
                className="cursor-pointer"
              >
                Social Links Center Footer
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-4">
        {/* Header Rendering */}
        {header === "DefaultHeader" && <DefaultHeader />}
        {header === "LinksCenterHeader" && <LinksCenterHeader />}
        {header === "NameCenterHeader" && <NameCenterHeader />}

        {/* Blog Card Rendering */}
        <div className="mt-8 flex flex-wrap gap-4 p-10">
          {card === "DefaultCard" && renderCards(DefaultCard, 5)}
          {card === "DateCard" && renderCards(DateCard, 5)}
          {card === "ImageCard" && renderCards(ImageCard, 5)}
        </div>

        {/* Footer Rendering */}
        <div className="mt-8">
          {footer === "DefaultFooter" && <DefaultFooter />}
          {footer === "EnhancedFooter" && <EnhancedFooter />}
          {footer === "LinksCenterFooter" && <LinksCenterFooter />}
        </div>
      </div>
    </div>
  );
}
