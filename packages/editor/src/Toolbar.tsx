import React from "react";
import { Button } from "@ui/components/button";

interface ToolbarProps {
  position: { top: number; left: number };
  onFormat: (format: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = React.memo(({ position, onFormat }) => (
  <div
    className="absolute bg-white border rounded shadow-lg p-1"
    style={{
      top: `${position.top}px`,
      left: `${position.left}px`,
    }}
  >
    <div className="flex space-x-1">
      <Button size="sm" variant="ghost" onClick={() => onFormat("b")}>
        Bold
      </Button>
      <Button size="sm" variant="ghost" onClick={() => onFormat("i")}>
        Italic
      </Button>
      <Button size="sm" variant="ghost" onClick={() => onFormat("u")}>
        Underline
      </Button>
    </div>
  </div>
));

Toolbar.displayName = "Toolbar";
