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
import { WorkspacePanel } from "@/components/rooms/WorkspacePanel";
import { WorkspaceToolbar } from "@/components/rooms/WorkspaceToolbar";
import { ConsolePanel } from "@/components/rooms/ConsolePanel";

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
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

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
    <div className="fixed inset-0 flex flex-col bg-background">
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

      {/* Professional Toolbar */}
      <WorkspaceToolbar
        roomCode={room_code}
        roomName={data?.name || "Unnamed Room"}
        language={data?.language || "Unknown"}
        isOwner={data?.owner_id === user?.id}
        isConnected={isConnected}
        participantCount={participants.length}
        onLeaveRoom={handleLeaveRoom}
        onOpenInvite={() => {
          setToolsDefaultTab(data?.owner_id === user?.id ? "invite" : "logs");
          setIsToolsPanelOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden flex gap-4 p-4 sm:p-6">
          {/* Left: Editor Section */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Code Editor */}
            <div className="flex-1 rounded-lg border border-border/40 bg-card overflow-hidden flex flex-col shadow-sm min-h-0">
              <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border/30 bg-background/50 flex-shrink-0">
                <div>
                  <h2 className="font-semibold text-sm">Code</h2>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary">
                  {data?.language}
                </span>
              </div>
              <div className="flex-1 overflow-hidden min-h-0 bg-slate-950">
                {!initialCode ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin w-6 h-6 rounded-full border-2 border-border border-t-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Loading editor...</p>
                    </div>
                  </div>
                ) : (
                  <MonacoEditor initialCode={initialCode} />
                )}
              </div>
            </div>

            {/* Version History */}
            <div className="h-32 rounded-lg border border-border/40 bg-card overflow-hidden flex flex-col shadow-sm flex-shrink-0">
              <div className="px-4 py-2 border-b border-border/30 bg-background/50 flex-shrink-0">
                <h2 className="font-semibold text-sm">Version History</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <RoomVersions roomCode={room_code} />
              </div>
            </div>
          </div>

          {/* Right: Collaboration Panel */}
          <aside className="w-80 flex-shrink-0 min-w-0">
            <WorkspacePanel
              roomCode={room_code}
              currentUserId={user?.id}
              isOwner={data?.owner_id === user?.id}
              participants={participants}
              isAudioEnabled={data?.is_audio_enabled}
              isVideoEnabled={data?.is_video_enabled}
            />
          </aside>
        </div>

        {/* Console Panel */}
        <ConsolePanel
          isRunning={false}
          output={consoleOutput}
          onClear={() => setConsoleOutput([])}
          isExpanded={isConsoleExpanded}
          onToggleExpand={setIsConsoleExpanded}
          minHeight={80}
          maxHeight={400}
        />
      </div>
    </div>
  );
};

export default RoomWorkspace;
