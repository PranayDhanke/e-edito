'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Trash2,
  Copy,
  Pause,
  Play,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsoleMessage {
  id: string;
  type: 'log' | 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: Date;
  stack?: string;
}

interface ConsoleOutputPanelProps {
  messages?: ConsoleMessage[];
  isRunning?: boolean;
  onClear?: () => void;
  onTogglePause?: () => void;
  isPaused?: boolean;
  maxMessages?: number;
}

const typeConfig = {
  log: {
    icon: Zap,
    color: 'text-editor-fg',
    bgColor: 'bg-transparent',
    label: 'Log',
  },
  error: {
    icon: AlertCircle,
    color: 'text-ide-error',
    bgColor: 'bg-ide-error/5',
    label: 'Error',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-ide-warning',
    bgColor: 'bg-ide-warning/5',
    label: 'Warning',
  },
  info: {
    icon: Info,
    color: 'text-ide-info',
    bgColor: 'bg-ide-info/5',
    label: 'Info',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-ide-success',
    bgColor: 'bg-ide-success/5',
    label: 'Success',
  },
};

export function ConsoleOutputPanel({
  messages = [],
  isRunning = false,
  onClear,
  onTogglePause,
  isPaused = false,
  maxMessages = 1000,
}: ConsoleOutputPanelProps) {
  const [copied, setCopied] = React.useState(false);
  const [autoScroll, setAutoScroll] = React.useState(true);
  const consoleEndRef = React.useRef<HTMLDivElement>(null);

  const displayedMessages = React.useMemo(
    () => messages.slice(-maxMessages),
    [messages, maxMessages]
  );

  React.useEffect(() => {
    if (autoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedMessages, autoScroll]);

  const handleCopyAll = () => {
    const text = displayedMessages
      .map((m) => `[${m.type.toUpperCase()}] ${m.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (type: ConsoleMessage['type']) => {
    const Icon = typeConfig[type].icon;
    return <Icon className="h-3.5 w-3.5 flex-shrink-0" />;
  };

  return (
    <div className="flex flex-col h-full bg-editor-bg text-editor-fg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border/30 bg-toolbar-bg px-3 py-2 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              isRunning
                ? 'bg-ide-success animate-pulse shadow-lg shadow-green-600/50'
                : 'bg-muted-foreground'
            )}
          />
          <span className="text-xs font-semibold uppercase tracking-wider">Console</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {displayedMessages.length} message{displayedMessages.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
          >
            {autoScroll ? (
              <Zap className="h-3.5 w-3.5" />
            ) : (
              <Zap className="h-3.5 w-3.5 opacity-40" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onTogglePause}
            title={isPaused ? 'Resume console' : 'Pause console'}
          >
            {isPaused ? (
              <Play className="h-3.5 w-3.5" />
            ) : (
              <Pause className="h-3.5 w-3.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleCopyAll}
            title="Copy all output"
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-ide-success" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:text-destructive"
            onClick={onClear}
            title="Clear console"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Output Area */}
      <div className="flex-1 overflow-y-auto font-mono text-xs p-3 space-y-1 bg-editor-bg">
        {displayedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Ready to execute code...</p>
          </div>
        ) : (
          <>
            {displayedMessages.map((msg) => {
              const config = typeConfig[msg.type];
              const Icon = config.icon;

              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2 py-1 px-2 rounded group hover:bg-background/20 transition-colors',
                    config.bgColor
                  )}
                >
                  <Icon className={cn('flex-shrink-0 mt-0.5', config.color)} />
                  <div className="flex-1 min-w-0">
                    <p className={cn('break-words', config.color)}>{msg.message}</p>
                    {msg.stack && (
                      <details className="mt-1 cursor-pointer">
                        <summary className="text-muted-foreground text-xs hover:text-foreground">
                          Stack trace
                        </summary>
                        <pre className="mt-1 bg-background/50 p-2 rounded text-xs overflow-x-auto text-muted-foreground">
                          {msg.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                  <span className="text-muted-foreground/50 text-xs flex-shrink-0 group-hover:opacity-100 opacity-0 transition-opacity">
                    {msg.timestamp.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
              );
            })}
            <div ref={consoleEndRef} className="h-0" />
          </>
        )}
      </div>

      {/* Footer Status */}
      <div className="border-t border-border/30 bg-toolbar-bg px-3 py-1.5 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{isRunning ? '✓ Running' : '● Idle'}</span>
          <span>{isPaused ? '⏸ Paused' : ''}</span>
        </div>
      </div>
    </div>
  );
}
