'use client';

import { Button } from '@/components/ui/button';
import {
  Play,
  Save,
  Copy,
  Settings,
  LogOut,
  Users,
  RotateCcw,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface IDEToolbarProps {
  roomCode: string;
  roomName: string;
  language: string;
  isConnected: boolean;
  onRun?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  onShare?: () => void;
  onLeave?: () => void;
  isRunning?: boolean;
  isSaving?: boolean;
  isOwner?: boolean;
  participantCount?: number;
}

export function IDEToolbar({
  roomCode,
  roomName,
  language,
  isConnected,
  onRun,
  onSave,
  onReset,
  onShare,
  onLeave,
  isRunning = false,
  isSaving = false,
  isOwner = false,
  participantCount = 0,
}: IDEToolbarProps) {
  return (
    <div className="bg-background border-b border-border/40">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border/20">
        {/* Left: Branding + Room Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">&lt;/&gt;</span>
            </div>
            <span className="font-semibold text-sm hidden sm:inline">EDITO</span>
          </Link>

          <div className="h-6 w-px bg-border/30" />

          {/* Room Info */}
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold text-foreground truncate">{roomName}</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={cn(
                  'inline-block w-2 h-2 rounded-full',
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                )}
              />
              <span>{language}</span>
              <span>•</span>
              <span className="font-mono text-xs">{roomCode}</span>
            </div>
          </div>
        </div>

        {/* Center: Primary Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            onClick={onRun}
            disabled={isRunning}
            className="gap-1.5 min-w-[92px] bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <Play className="size-3.5" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onSave}
            disabled={isSaving}
            className="gap-1.5 min-w-[92px]"
          >
            <Save className="size-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </Button>

          {onReset && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
              title="Reset to last saved version"
              className="gap-1.5"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          )}
        </div>

        {/* Right: Secondary Actions + Status */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {onShare && (
            <Button
              size="sm"
              variant="outline"
              onClick={onShare}
              title="Invite people"
              className="gap-1.5 min-w-[92px]"
            >
              <UserPlus className="size-3.5" />
              <span>Invite</span>
            </Button>
          )}

          {isOwner && (
            <Button
              size="sm"
              variant="ghost"
              title="Room settings"
              className="gap-1.5"
            >
              <Settings className="size-3.5" />
            </Button>
          )}

          {/* Participant Count */}
          {participantCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5"
              title={`${participantCount} participant${participantCount !== 1 ? 's' : ''}`}
            >
              <Users className="size-3.5" />
              <span className="text-xs font-semibold">{participantCount}</span>
            </Button>
          )}

          {/* Room Code Copy */}
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              await navigator.clipboard.writeText(roomCode);
            }}
            title="Copy room code"
            className="gap-1.5 font-mono text-xs"
          >
            <Copy className="size-3.5" />
            <span className="hidden sm:inline">{roomCode}</span>
          </Button>

          {/* Leave Button */}
          {onLeave && (
            <Button
              size="sm"
              variant="destructive"
              onClick={onLeave}
              className="gap-1.5"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Leave</span>
            </Button>
          )}
        </div>
      </div>

      {/* Secondary Toolbar (Editor Controls) */}
      <div className="flex items-center gap-1 px-4 py-1.5 bg-background/50">
        <div className="text-xs text-muted-foreground font-medium">Editor:</div>

        {/* Format/Edit Actions */}
        <div className="flex items-center gap-0.5 ml-2 pl-2 border-l border-border/20">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            title="Format document"
          >
            Format
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            title="Find and replace"
          >
            Find
          </Button>
        </div>

        {/* Right side editor status */}
        <div className="flex-1" />
        <div className="text-xs text-muted-foreground flex items-center gap-3">
          <span>0 problems</span>
          <span>Line 1, Col 1</span>
        </div>
      </div>
    </div>
  );
}
