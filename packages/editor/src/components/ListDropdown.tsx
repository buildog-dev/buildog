import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Button } from "@ui/components/ui/button";
import { ListBullets, ListNumbers, ListChecks, CaretDown } from "@ui/components/react-icons";
import type { Editor } from "@tiptap/react";

export const ListDropdown = ({
  editor,
  showBulletList,
  showOrderedList,
  showTaskList,
}: {
  editor: Editor;
  showBulletList: boolean;
  showOrderedList: boolean;
  showTaskList: boolean;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm">
        {editor.isActive("bulletList") ? (
          <ListBullets />
        ) : editor.isActive("orderedList") ? (
          <ListNumbers />
        ) : editor.isActive("taskList") ? (
          <ListChecks />
        ) : (
          <ListBullets />
        )}
        <CaretDown />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {showBulletList && (
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBullets className="mr-2" /> Bullet List
        </DropdownMenuItem>
      )}
      {showOrderedList && (
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListNumbers className="mr-2" /> Ordered List
        </DropdownMenuItem>
      )}
      {showTaskList && (
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <ListChecks className="mr-2" /> Task List
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);
