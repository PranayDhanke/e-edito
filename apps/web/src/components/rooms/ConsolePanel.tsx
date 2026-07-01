"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, ChevronDown, ChevronUp, Maximize2 } from "lucide-react";
import { toast } from "sonner";

interface ConsoleOutput {
  id: string;
  type: "log" | "error" | "warning" | "info" | "success";
  message: string;
  timestamp: Date;
}

interface ConsolePanelProps {
  isRunning?: boolean;
  output?: ConsoleOutput[];
  onClear?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
  minHeight?: number;
  maxHeight?: number;
}

const typeStyles: Record<string, string> = {
  log: "text-foreground",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
  success: "text-green-500",
};

const typeBgStyles: Record<string, string> = {
  log: "bg-transparent",
  error: "bg-red-500/5",
  warning: "bg-yellow-500/5",
  info: "bg-blue-500/5",
  success: "bg-green-500/5",
};

export const ConsolePanel = ({
  isRunning = false,
  output = [],
  onClear,
  isExpanded = true,
  onToggleExpand,
  minHeight = 100,
  maxHeight = 400,
}: ConsolePanelProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(200);
  const [localOutput, setLocalOutput] = useState<ConsoleOutput[]>(output);
  const bottomRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalOutput(output);
    // Auto-scroll to bottom
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [output]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newHeight = rect.bottom - e.clientY;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, minHeight, maxHeight]);

  const handleCopyAll = () => {
    const text = localOutput
      .map((line) => `[${line.type.toUpperCase()}] ${line.message}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Console output copied");
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => onToggleExpand?.(true)}
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
      >
        <ChevronUp className="w-4 h-4" />
        Show Console
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className="border-t border-border/50 bg-background flex flex-col"
      style={{ height: `${height}px` }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 flex-shrink-0 bg-background/50">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold">Console</h3>
          {isRunning && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Running
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {localOutput.length} line{localOutput.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyAll}
            disabled={localOutput.length === 0}
            title="Copy all output"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onClear?.();
              setLocalOutput([]);
            }}
            disabled={localOutput.length === 0}
            title="Clear console"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleExpand?.(false)}
            title="Collapse console"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto bg-slate-950/50 font-mono text-xs">
        {localOutput.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No output yet. Run code to see results here.</p>
          </div>
        ) : (
          <div className="p-4 space-y-1">
            {localOutput.map((line) => (
              <div
                key={line.id}
                className={`${typeBgStyles[line.type]} ${typeStyles[line.type]} px-2 py-1 rounded whitespace-pre-wrap break-words`}
              >
                <span className="text-muted-foreground mr-2">
                  [{line.type.toUpperCase()}]
                </span>
                {line.message}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Resize handle */}
      <div
        ref={resizeRef}
        onMouseDown={() => setIsDragging(true)}
        className="h-1 bg-border/50 hover:bg-primary/50 cursor-ns-resize transition-colors flex-shrink-0"
        title="Drag to resize console"
      />
    </div>
  );
};
