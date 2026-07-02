'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Play,
  Save,
  RotateCcw,
  Share2,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  Settings,
  Maximize2,
  Code,
  FileText,
  Users,
  AlertCircle,
  Check,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EditorToolbarProps {
  roomCode: string;
  language: string;
  isConnected: boolean;
  isDarkMode: boolean;
  fontSize: number;
  onRun?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  onShare?: () => void;
  onToggleTheme?: () => void;
  onFontSizeChange?: (size: number) => void;
  onOpenSettings?: () => void;
  onToggleFullscreen?: () => void;
  participantCount?: number;
}

export function EditorToolbar({
  roomCode,
  language,
  isConnected,
  isDarkMode,
  fontSize,
  onRun,
  onSave,
  onReset,
  onShare,
  onToggleTheme,
  onFontSizeChange,
  onOpenSettings,
  onToggleFullscreen,
  participantCount = 1,
}: EditorToolbarProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-14 items-center justify-between gap-2 border-b border-toolbar-border bg-toolbar-bg px-4 py-2">
      {/* Left Section: Room Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-1">
            <Code className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold text-accent">{language}</span>
          </span>
        </div>
        
        <div className="h-6 w-px bg-border/30" />
        
        <button
          onClick={handleCopyRoomCode}
          className="group flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
          title="Click to copy room code"
        >
          <FileText className="h-3.5 w-3.5" />
          <code className="font-mono tracking-wider">{roomCode}</code>
          {copied && <Check className="h-3 w-3 text-green-600" />}
        </button>

        {/* Connection Status */}
        <div className="flex items-center gap-1.5">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? 'bg-green-600 shadow-lg shadow-green-600/50' : 'bg-red-600'
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Participant Count */}
        {participantCount > 0 && (
          <>
            <div className="h-6 w-px bg-border/30" />
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">{participantCount}</span>
            </div>
          </>
        )}
      </div>

      {/* Middle Section: Editor Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRun}
          className="gap-1.5 text-xs font-medium hover:bg-accent/20 hover:text-accent"
          title="Run code (Ctrl+Enter)"
        >
          <Play className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Run</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="gap-1.5 text-xs font-medium hover:bg-accent/20 hover:text-accent"
          title="Save version (Ctrl+S)"
        >
          <Save className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Save</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="gap-1.5 text-xs font-medium hover:bg-destructive/20 hover:text-destructive"
          title="Reset editor"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="gap-1.5 text-xs font-medium hover:bg-accent/20 hover:text-accent"
          title="Share room"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>

      {/* Right Section: Display & Settings */}
      <div className="flex items-center gap-1">
        {/* Font Size Controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-medium"
              title="Font size"
            >
              <span className="text-xs text-muted-foreground">{fontSize}px</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuLabel>Font Size</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[12, 14, 16, 18, 20, 24].map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => onFontSizeChange?.(size)}
                className={fontSize === size ? 'bg-accent/20' : ''}
              >
                <span className="text-sm">{size}px</span>
                {fontSize === size && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border/30" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="h-8 w-8 p-0"
          title="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Zoom Controls */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        {/* Fullscreen Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFullscreen}
          className="h-8 w-8 p-0"
          title="Toggle fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {/* Settings Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Show Version History</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>Keyboard Shortcuts</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
