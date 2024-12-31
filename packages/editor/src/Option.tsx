import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Button } from "@ui/components/button";
import {
  DotsThreeVertical,
  Paragraph,
  TextHOne,
  TextHThree,
  TextHTwo,
} from "@ui/components/react-icons";

export default function Option({
  handleTagChange,
}: {
  handleTagChange: (tag: keyof JSX.IntrinsicElements) => void;
}) {
  const turnIntoMenuItems = [
    { icon: Paragraph, tag: "p", label: "Paragraph", onClick: () => handleTagChange("p") },
    { icon: TextHOne, tag: "h1", label: "Heading 1", onClick: () => handleTagChange("h1") },
    { icon: TextHTwo, tag: "h2", label: "Heading 2", onClick: () => handleTagChange("h2") },
    { icon: TextHThree, tag: "h3", label: "Heading 3", onClick: () => handleTagChange("h3") },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="px-1 invisible cursor-pointer group-hover:visible">
        <Button size="icon" variant="ghost">
          <DotsThreeVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Turn into</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {turnIntoMenuItems.map((item) => (
                  <DropdownMenuItem
                    className="gap-1 h-[45px] w-[150px]"
                    onClick={item.onClick}
                    key={item.tag}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
