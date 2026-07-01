"use client";

import { Member } from "@repo/shared-types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Video } from "lucide-react";
import Participant from "./Participant";
import RoomCall from "./RoomCall";
import RoomMessages from "./RoomMessages";

type PanelTab = "participants" | "messages" | "video";

interface WorkspacePanelProps {
  roomCode: string;
  currentUserId?: string;
  isOwner: boolean;
  participants: Member[];
  isAudioEnabled?: boolean;
  isVideoEnabled?: boolean;
}

export const WorkspacePanel = ({
  roomCode,
  currentUserId,
  isOwner,
  participants,
  isAudioEnabled,
  isVideoEnabled,
}: WorkspacePanelProps) => {
  const [activeTab, setActiveTab] = useState<PanelTab>("participants");

  const tabs: Array<{ id: PanelTab; label: string; icon: React.ReactNode }> = [
    { id: "participants", label: "Participants", icon: <Users className="size-4" /> },
    { id: "messages", label: "Messages", icon: <MessageSquare className="size-4" /> },
    { id: "video", label: "Video", icon: <Video className="size-4" /> },
  ];

  return (
    <div className="rounded-lg border border-border/40 bg-card overflow-hidden flex flex-col h-full shadow-sm">
      {/* Tab Header */}
      <div className="border-b border-border/30 px-4 py-2 bg-background/50 flex-shrink-0">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 whitespace-nowrap text-xs rounded-md"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {activeTab === "participants" && (
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-3">
              {participants.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No participants yet</p>
                  </div>
                </div>
              ) : (
                <Participant
                  roomCode={roomCode}
                  currentUserId={currentUserId}
                  isOwner={isOwner}
                  participants={participants}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <RoomMessages roomCode={roomCode} currentUserId={currentUserId} />
            </div>
          </div>
        )}

        {activeTab === "video" && (
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-3">
              {isAudioEnabled || isVideoEnabled ? (
                <RoomCall
                  currentUserId={currentUserId}
                  isAudioEnabled={isAudioEnabled}
                  isVideoEnabled={isVideoEnabled}
                  participants={participants}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <Video className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Audio and video are disabled</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
