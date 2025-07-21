"use client";

import { useEffect, useState } from "react";
import { StickyNote } from "@/components/ui/StickyNote";

export function StickyNotesContainer() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const getSafePosition = (
    side: "left" | "right",
    verticalPercentage: number,
  ) => {
    const verticalPosition = (dimensions.height * verticalPercentage) / 100;

    switch (side) {
      case "left":
        return {
          x: dimensions.width * 0.15, // Negative 15% to push to actual left edge
          y: verticalPosition,
        };
      case "right":
        return {
          x: dimensions.width * 1.85, // 95% from left to push to actual right edge
          y: verticalPosition,
        };
      default:
        return {
          x: dimensions.width * 1,
          y: verticalPosition,
        };
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="relative w-full h-full">
        {/* Left side - Top (10% down from top) */}
        <StickyNote
          id="welcome"
          content="Welcome to my little corner! ☀️

Pull up a chair and stay awhile..."
          color="yellow"
          initialPosition={getSafePosition("left", 10)}
          rotation={-6}
          className="pointer-events-auto hidden lg:block"
        />

        {/* Left side - Bottom (60% down from top) */}
        <StickyNote
          id="latest"
          content="Fresh stories below! 📖

Like warm cookies from the oven"
          color="peach"
          initialPosition={getSafePosition("left", 66)}
          rotation={8}
          className="pointer-events-auto hidden lg:block"
        />

        {/* Right side - Top (10% down from top) */}
        <StickyNote
          id="tip"
          content="Psst... I'm draggable! 🎭

Try moving me around!"
          color="mint"
          initialPosition={getSafePosition("right", 40)}
          rotation={-4}
          className="pointer-events-auto hidden xl:block"
        />

        {/* Right side - Bottom (60% down from top) */}
        <StickyNote
          id="thought"
          content="Sometimes the best ideas come from the simplest moments... 💭"
          color="lavender"
          initialPosition={getSafePosition("right", 160)}
          rotation={12}
          className="pointer-events-auto hidden xl:block"
        />
      </div>
    </div>
  );
}
