import { Button } from "@ui/components/button";
import { Plus } from "@ui/components/react-icons";

export default function CreateNewLine({ handleAddEditor }: { handleAddEditor: () => void }) {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="invisible group-hover:visible cursor-pointer"
      onClick={handleAddEditor}
    >
      <Plus className="w-4 h-4" />
    </Button>
  );
}
