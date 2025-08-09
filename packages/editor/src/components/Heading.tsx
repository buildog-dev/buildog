import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Button } from "@ui/components/ui/button";
import { CaretDown, TextHOne, TextHTwo, TextHThree } from "@ui/components/react-icons";
import type { Editor } from "@tiptap/react";

export const Heading = ({
  editor,
  headingLevels,
  activeHeading,
}: {
  editor: Editor;
  headingLevels: Array<1 | 2 | 3>;
  activeHeading: 1 | 2 | 3 | undefined;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm">
        {activeHeading ? `H${activeHeading}` : "H"} <CaretDown className="ml-1  h-3 w-3" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {headingLevels.map((level) => (
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          key={`h${level}`}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        >
          {level === 1 ? <TextHOne /> : level === 2 ? <TextHTwo /> : <TextHThree />}
          Heading {level}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
