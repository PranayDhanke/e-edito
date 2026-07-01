"use client";

import { Button } from "@/components/ui/button";
import {
  Copy,
  LogOut,
  Save,
  Share2,
  RotateCcw,
  Zap,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface WorkspaceToolbarProps {
  roomCode: string;
  roomName: string;
  language: string;
  isOwner: boolean;
  isConnected: boolean;
  participantCount: number;
  isSaving?: boolean;
  isAutoSaving?: boolean;
  onLeaveRoom: () => void;
  onSaveVersion?: () => void;
  onRunCode?: () => void;
  onOpenInvite: () => void;
}

export const WorkspaceToolbar = ({
  roomCode,
  roomName,
  language,
  isOwner,
  isConnected,
  participantCount,
  isSaving,
  isAutoSaving,
  onLeaveRoom,
  onSaveVersion,
  onRunCode,
  onOpenInvite,
}: WorkspaceToolbarProps) => {
  const [copiedTimeout, setCopiedTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      toast.success("Room code copied");
      
      if (copiedTimeout) clearTimeout(copiedTimeout);
      const timeout = setTimeout(() => setCopiedTimeout(null), 2000);
      setCopiedTimeout(timeout);
    } catch {
      toast.error("Failed to copy room code");
    }
  };

  return (
    <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
      {/* Top row: Title and connection status */}
      <div className="px-4 py-3 sm:px-6 flex items-center justify-between gap-4 border-b border-border/30">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
                {roomName}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isConnected ? "bg-emerald-500" : "bg-amber-500"
                }`} />
                <span>
                  {isConnected ? "Connected" : "Connecting..."} • {participantCount} participant{participantCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Connection status and save indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
          {isAutoSaving && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 text-blue-600">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Auto saving...
            </div>
          )}
          {isSaving && !isAutoSaving && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 text-green-600">
              <Check className="w-3.5 h-3.5" />
              Saved
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Controls */}
      <div className="px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Language badge */}
          <span className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
            {language}
          </span>

          {/* Room code */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            className="gap-2"
          >
            <span className="font-mono text-xs">{roomCode}</span>
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Primary actions */}
          {onRunCode && (
            <Button
              variant="default"
              size="sm"
              onClick={onRunCode}
              className="gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              Run
            </Button>
          )}

          {onSaveVersion && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveVersion}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              Save Version
            </Button>
          )}

          {/* Secondary actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenInvite}
            className="gap-2"
          >
            <Share2 className="w-3.5 h-3.5" />
            Invite
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onLeaveRoom}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <LogOut className="w-3.5 h-3.5" />
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
};
