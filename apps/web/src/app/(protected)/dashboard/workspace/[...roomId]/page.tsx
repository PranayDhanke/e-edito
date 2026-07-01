"use client";

import { useGetRoom } from "@/api/hooks/room/getRoomDetail";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "@/socket/socket-provider";
import { Member, SocketEvent } from "@repo/shared-types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Copy, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useLeaveRoom } from "@/api/hooks/room/leaveRoom";
import InviteButton from "@/components/rooms/InviteButton";
import { Button } from "@/components/ui/button";
import RoomVersions from "@/components/rooms/RoomVersions";
import MonacoEditor from "@/components/rooms/Editor";
import { RoomToolsPanel } from "@/components/rooms/RoomToolsPanel";
import { IDELayout } from "@/components/ide/IDELayout";
import { IDEToolbar } from "@/components/ide/IDEToolbar";
import { IDESidebar } from "@/components/ide/IDESidebar";
import { IDERightPanel } from "@/components/ide/IDERightPanel";
import Participant from "@/components/rooms/Participant";
import { RoomMessages } from "@/components/rooms/RoomMessages";
import RoomCall from "@/components/rooms/RoomCall";

const statCardStyles = [
  "from-[#fff3d6] via-[#fff8ea] to-[#fffef8] text-amber-950",
  "from-[#dff4ff] via-[#eef9ff] to-[#f8fdff] text-sky-950",
  "from-[#e8f7e8] via-[#f2fcf2] to-[#fbfffb] text-emerald-950",
  "from-[#f4ecff] via-[#faf6ff] to-[#fffaff] text-violet-950",
];

const RoomWorkspace = () => {
  //userId
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  //get the search parasm and param
  const param = useParams();
  const queryParams = useSearchParams();

  const [participants, setParticipants] = useState<Member[]>([]);
  const [initialCode, setInitialCode] = useState<Uint8Array>();
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const [toolsDefaultTab, setToolsDefaultTab] = useState<"invite" | "logs">(
    "invite",
  );
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [bottomPanelCollapsed, setBottomPanelCollapsed] = useState(false);

  const room_code = param.roomId?.[0] as string;

  const role = queryParams.get("role") || "viewer";

  const socket = useSocket();

  const { data, isLoading, error } = useGetRoom(room_code);

  const [isLeaving, setIsLeaving] = useState(false);

  const { mutateAsync } = useLeaveRoom();

  const handleLeaveRoom = async () => {
    if (!room_code || !user?.id || isLeaving) {
      return;
    }

    setIsLeaving(true);

    try {
      await mutateAsync(room_code);

      socket?.emit(SocketEvent.LEAVE_ROOM);

      toast.success("You left the room");

      router.push("/dashboard");
    } catch (leaveError) {
      toast.error(
        leaveError instanceof Error
          ? leaveError.message
          : "Failed to leave room",
      );
    } finally {
      setIsLeaving(false);
    }
  };

  const handleSocketError = useCallback((payload: unknown) => {
    console.log("socket error", payload);
  }, []);

  const handleRoomJoin = useCallback(
    async (participant: Member[]) => {
      setParticipants(participant);
    },
    [],
  );

  const handleInitialCode = (update: Uint8Array) => {
    setInitialCode(update);
  };

  useEffect(() => {
    if (!socket || !room_code) {
      return;
    }

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on(SocketEvent.ERROR, handleSocketError);
    socket.on(SocketEvent.ROOM_JOINED, handleRoomJoin);
    socket.on(SocketEvent.INITIAL_CODE, handleInitialCode);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setIsConnected(true);
      socket.emit(SocketEvent.JOIN_ROOM, { room_code, role });
    } else {
      socket.once("connect", () => {
        setIsConnected(true);
        socket.emit(SocketEvent.JOIN_ROOM, { room_code, role });
      });
    }

    return () => {
      socket.off(SocketEvent.ERROR, handleSocketError);
      socket.off(SocketEvent.ROOM_JOINED, handleRoomJoin);
      socket.off(SocketEvent.INITIAL_CODE, handleInitialCode);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [handleRoomJoin, handleSocketError, role, room_code, socket]);

  if (isLoading && !participants && !initialCode) {
    return (
      <div className="min-h-[70vh] rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Loading room workspace...
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: "Language",
      value: data?.language || "Unknown",
      helper: "Editor runtime",
    },
    {
      label: "Status",
      value: data?.status || "Unknown",
      helper: "Current room state",
    },
    {
      label: "Participants",
      value: `${participants.length}/${data?.maxParticipants || 0}`,
      helper: "Live seats in use",
    },
    {
      label: "Visibility",
      value: data?.is_public ? "Public" : "Private",
      helper: "Join access mode",
    },
  ];

  if (error) {
    return (
      <div className="rounded-[2rem] border border-destructive/30 bg-destructive/5 p-8 text-sm text-destructive">
        Error loading room {error.message}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-[70vh] rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">Loading user...</p>
      </div>
    );
  }

  return (
    <>
      <RoomToolsPanel
        key={`${room_code}-${toolsDefaultTab}-${isToolsPanelOpen ? "open" : "closed"}`}
        open={isToolsPanelOpen}
        onClose={() => setIsToolsPanelOpen(false)}
        defaultTab={toolsDefaultTab}
        roomCode={room_code}
        userId={data?.owner_id || ""}
        audioStatus={!!data?.is_audio_enabled}
        videoStatus={!!data?.is_video_enabled}
        isOwner={data?.owner_id === user?.id}
      />

      <IDELayout
        topBar={
          <IDEToolbar
            roomCode={room_code}
            roomName={data?.name || "Unnamed Room"}
            language={data?.language || "Unknown"}
            isConnected={isConnected}
            participantCount={participants.length}
            onRun={() => {
              console.log("[v0] Running code");
            }}
            onSave={() => {
              console.log("[v0] Saving version");
            }}
            onShare={() => {
              setToolsDefaultTab("invite");
              setIsToolsPanelOpen(true);
            }}
            onLeave={handleLeaveRoom}
            isOwner={data?.owner_id === user?.id}
          />
        }
        sidebar={
          <IDESidebar
            language={data?.language}
            roomCode={room_code}
            versionHistory={<RoomVersions roomCode={room_code} />}
          />
        }
        editor={
          !initialCode ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 rounded-full border-2 border-border border-t-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Loading editor...</p>
              </div>
            </div>
          ) : (
            <MonacoEditor initialCode={initialCode} />
          )
        }
        rightPanel={
          <IDERightPanel
            participants={
              <Participant
                roomCode={room_code}
                currentUserId={user?.id}
                isOwner={data?.owner_id === user?.id}
                participants={participants}
              />
            }
            messages={<RoomMessages roomCode={room_code} currentUserId={user?.id} />}
            video={
              data?.is_audio_enabled || data?.is_video_enabled ? (
                <RoomCall
                  currentUserId={user?.id}
                  isAudioEnabled={data?.is_audio_enabled}
                  isVideoEnabled={data?.is_video_enabled}
                  participants={participants}
                />
              ) : null
            }
          />
        }
        bottomPanel={
          <div className="flex flex-col h-full bg-background overflow-hidden">
            <div className="px-4 py-2 border-b border-border/30 bg-background/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider">Console Output</h3>
                <span className="text-xs text-muted-foreground">0 lines</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-muted-foreground">
              <div className="text-slate-500">$ Ready to execute code</div>
            </div>
          </div>
        }
        onSidebarCollapse={setSidebarCollapsed}
        onRightPanelCollapse={setRightPanelCollapsed}
        onBottomPanelCollapse={setBottomPanelCollapsed}
        defaultSidebarWidth={280}
        defaultRightPanelWidth={320}
        defaultBottomPanelHeight={200}
      />
    </>
  );
};

export default RoomWorkspace;
