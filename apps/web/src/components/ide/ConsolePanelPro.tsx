'use client';

import { Button } from '@/components/ui/button';
import { Trash2, Copy, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ConsoleOutput {
  id: string;
  type: 'log' | 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: Date;
}

interface ConsolePanelProProps {
  output?: ConsoleOutput[];
  isRunning?: boolean;
  onClear?: () => void;
  onScroll?: (scrollTop: number) => void;
}

export function ConsolePanelPro({
  output = [],
  isRunning = false,
  onClear,
}: ConsolePanelProProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(false);

  const typeColors = {
    log: 'text-foreground',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    success: 'text-green-500',
  };

  const typeIcons = {
    log: '›',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ',
    success: '✓',
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border/30 bg-background/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Output</span>
            <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-background/60 text-muted-foreground">
              {output.length}
            </span>
          </div>

          {isRunning && (
            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-500 font-medium">Running</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2"
            onClick={() => setShowTimestamps(!showTimestamps)}
            title="Toggle timestamps"
          >
            <span className="text-xs">Time</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2"
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
          >
            <ChevronDown className={cn('size-3.5', autoScroll && 'opacity-100')} />
          </Button>

          {output.length > 0 && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={() => {
                  navigator.clipboard.writeText(output.map(o => o.message).join('\n'));
                }}
                title="Copy all output"
              >
                <Copy className="size-3.5" />
              </Button>

              {onClear && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-destructive hover:text-destructive"
                  onClick={onClear}
                  title="Clear console"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Console Output */}
      <div className="flex-1 overflow-y-auto font-mono text-xs">
        {output.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground/50 p-4">
            <p>Ready. Run code to see output.</p>
          </div>
        ) : (
          <div className="p-3 space-y-0.5">
            {output.map((line) => (
              <div
                key={line.id}
                className={cn(
                  'flex items-start gap-2 py-0.5 px-1 rounded hover:bg-background/50 transition-colors',
                  typeColors[line.type]
                )}
              >
                <span className="flex-shrink-0 w-4 text-center opacity-60">
                  {typeIcons[line.type]}
                </span>
                {showTimestamps && (
                  <span className="flex-shrink-0 text-muted-foreground/50">
                    {line.timestamp.toLocaleTimeString()}
                  </span>
                )}
                <span className="break-all flex-1">{line.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Console Footer Status */}
      <div className="px-3 py-1.5 border-t border-border/30 bg-background/50 flex-shrink-0 text-xs text-muted-foreground/60 flex items-center justify-between">
        <span>$ edito</span>
        {isRunning ? (
          <span className="text-yellow-500 animate-pulse">executing...</span>
        ) : (
          <span>ready</span>
        )}
      </div>
    </div>
  );
}
