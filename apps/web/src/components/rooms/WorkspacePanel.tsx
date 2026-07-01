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
    <div className="rounded-[2rem] border border-border/60 bg-card/85 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.4)] backdrop-blur overflow-hidden flex flex-col h-full max-h-[calc(100vh-200px)]">
      <div className="border-b border-border/60 p-3 shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 whitespace-nowrap text-xs"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0 p-3">
        {activeTab === "participants" && (
          <div className="space-y-2 overflow-y-auto flex-1">
            <Participant
              roomCode={roomCode}
              currentUserId={currentUserId}
              isOwner={isOwner}
              participants={participants}
            />
          </div>
        )}

        {activeTab === "messages" && (
          <RoomMessages roomCode={roomCode} currentUserId={currentUserId} />
        )}

        {activeTab === "video" && (
          <div className="overflow-y-auto flex-1">
            {isAudioEnabled || isVideoEnabled ? (
              <RoomCall
                currentUserId={currentUserId}
                isAudioEnabled={isAudioEnabled}
                isVideoEnabled={isVideoEnabled}
                participants={participants}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <p className="text-xs text-muted-foreground">Audio and video are disabled for this room.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
