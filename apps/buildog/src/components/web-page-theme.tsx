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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";

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
      <div className="shrink-0 w-[300px] min-h-[calc(100vh_-_122px)] space-y-2 p-4 border-r">
        <div>
          <label className="block text-sm font-medium mb-1">Header</label>
          <Select
            value={header}
            onValueChange={(value) =>
              setHeader(value as "DefaultHeader" | "LinksCenterHeader" | "NameCenterHeader")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Header" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DefaultHeader">Default Header</SelectItem>
              <SelectItem value="LinksCenterHeader">Links Center Header</SelectItem>
              <SelectItem value="NameCenterHeader">Name Center Header</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Blog Card</label>
          <Select
            value={card}
            onValueChange={(value) => setCard(value as "DefaultCard" | "DateCard" | "ImageCard")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Blog Card" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DefaultCard">Default Blog Card</SelectItem>
              <SelectItem value="DateCard">Blog Card With Date</SelectItem>
              <SelectItem value="ImageCard">Image Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Footer</label>
          <Select
            value={footer}
            onValueChange={(value) =>
              setFooter(value as "DefaultFooter" | "EnhancedFooter" | "LinksCenterFooter")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Footer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DefaultFooter">Default Footer</SelectItem>
              <SelectItem value="EnhancedFooter">Enhanced Footer</SelectItem>
              <SelectItem value="LinksCenterFooter">Social Links Center Footer</SelectItem>
            </SelectContent>
          </Select>
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
