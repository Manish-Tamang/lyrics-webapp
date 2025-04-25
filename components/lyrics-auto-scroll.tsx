"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, ChevronUp, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PageAutoScroll() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(20); // Default: 20 pixels per second (slower)
  const animationRef = useRef<number>();
  const lastScrollTime = useRef<number>(Date.now());

  const startScrolling = () => {
    const scroll = () => {
      const now = Date.now();
      const deltaTime = now - lastScrollTime.current;
      lastScrollTime.current = now;

      const pixelsToScroll = (scrollSpeed * deltaTime) / 1000;
      window.scrollBy({ top: pixelsToScroll, behavior: "smooth" });

      if (isScrolling) {
        animationRef.current = requestAnimationFrame(scroll);
      }
    };

    animationRef.current = requestAnimationFrame(scroll);
  };

  const stopScrolling = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    if (isScrolling) {
      startScrolling();
    } else {
      stopScrolling();
    }

    return () => stopScrolling();
  }, [isScrolling, scrollSpeed]);

  const handleSpeedChange = (value: number[]) => {
    setScrollSpeed(value[0]); // Extract first value from slider array
  };

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsScrolling(!isScrolling)}
              className="rounded-full"
            >
              {isScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isScrolling ? "Pause" : "Play"} page auto-scroll</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-center gap-2 w-32">
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
        <Slider
          value={[scrollSpeed]}
          onValueChange={handleSpeedChange}
          min={5} // Slower minimum speed
          max={50} // Slower maximum speed
          step={1} // Finer control
          className="w-full"
        />
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}