import { Button } from "@ui/components/button";
import React, { useState, useRef } from "react";

const colorMap: Record<string, string> = {
  red: "bg-red-500 hover:bg-red-700",
  blue: "bg-blue-500 hover:bg-blue-700",
  green: "bg-green-500 hover:bg-green-700",
  yellow: "bg-yellow-500 hover:bg-yellow-700",
  gray: "bg-gray-500 hover:bg-gray-700",
};

export default function LongPressButton({
  children,
  color,
  onDelete,
}: {
  children: React.ReactNode;
  color: string;
  onDelete: () => void;
}) {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const pressTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const holdDuration = 1000;

  const startPress = () => {
    setPressing(true);
    setProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressIntervalRef.current);
          return 100;
        }
        return prevProgress + 100 / (holdDuration / 100);
      });
    }, 100);

    pressTimeoutRef.current = setTimeout(() => {
      onDelete();
      resetPress();
    }, holdDuration);
  };

  const resetPress = () => {
    clearTimeout(pressTimeoutRef.current);
    clearInterval(progressIntervalRef.current);
    setPressing(false);
    setProgress(0);
  };

  const handleMouseUp = () => {
    resetPress();
  };

  const buttonBgClass = colorMap[color] || colorMap["gray"];
  const progressBgClass = `bg-${color}-500`;

  return (
    <div>
      <Button
        className={`relative w-full h-full text-white font-bold rounded-md overflow-hidden ${buttonBgClass}`}
        onMouseDown={startPress}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={startPress}
        onTouchEnd={handleMouseUp}
      >
        {children}
        <div
          className={`absolute top-0 left-0 h-full ${progressBgClass} opacity-30 transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        ></div>
      </Button>
    </div>
  );
}
