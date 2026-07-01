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

    socket.on(SocketEvent.ERROR, handleSocketError);
    socket.on(SocketEvent.ROOM_JOINED, handleRoomJoin);
    socket.on(SocketEvent.INITIAL_CODE, handleInitialCode);

    if (socket.connected) {
      socket.emit(SocketEvent.JOIN_ROOM, { room_code, role });
    } else {
      socket.once("connect", () => {
        socket.emit(SocketEvent.JOIN_ROOM, { room_code, role });
      });
    }

    return () => {
      socket.off(SocketEvent.ERROR, handleSocketError);
      socket.off(SocketEvent.ROOM_JOINED, handleRoomJoin);
      socket.off(SocketEvent.INITIAL_CODE, handleInitialCode);
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

      {/* Header */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur-sm px-4 py-3 sm:px-6 flex-shrink-0">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Active workspace
              </p>
              <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground">
                {data?.name || "Room workspace"}
              </h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(room_code);
                  toast.success("Room code copied");
                }}
              >
                <Copy className="size-3.5" />
                {room_code}
              </Button>
              <InviteButton
                onClick={() => {
                  setToolsDefaultTab(data?.owner_id === user?.id ? "invite" : "logs");
                  setIsToolsPanelOpen(true);
                }}
              />
              <Button
                size="sm"
                variant="destructive"
                disabled={isLeaving}
                onClick={handleLeaveRoom}
              >
                <LogOut className="size-3.5" />
                {isLeaving ? "Leaving..." : "Leave"}
              </Button>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-lg border border-white/50 bg-gradient-to-br p-3 shadow-sm text-xs",
                  statCardStyles[index % statCardStyles.length],
                )}
              >
                <p className="font-semibold uppercase tracking-[0.2em] opacity-70">
                  {stat.label}
                </p>
                <p className="mt-1 text-lg font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex gap-4 p-4 sm:p-6">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Code Editor */}
          <div className="flex-1 rounded-xl border border-border/60 bg-card/85 shadow-lg overflow-hidden flex flex-col backdrop-blur min-h-0">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border/60 bg-background/40 flex-shrink-0">
              <div>
                <h2 className="font-heading text-base font-semibold">
                  Live editor
                </h2>
                <p className="text-xs text-muted-foreground">
                  {data?.language} • Real-time collaboration
                </p>
              </div>
              <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground flex-shrink-0">
                {data?.language}
              </span>
            </div>
            <div className="flex-1 overflow-hidden min-h-0 bg-slate-950">
              {!initialCode ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Loading editor...
                </div>
              ) : (
                <MonacoEditor initialCode={initialCode} />
              )}
            </div>
          </div>

          {/* Version History */}
          <div className="h-40 rounded-xl border border-border/60 bg-card/85 shadow-lg overflow-hidden flex flex-col backdrop-blur flex-shrink-0">
            <div className="px-4 py-3 border-b border-border/60 bg-background/40 flex-shrink-0">
              <h2 className="font-heading text-base font-semibold">
                Version history
              </h2>
              <p className="text-xs text-muted-foreground">
                Recent saved states
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <RoomVersions roomCode={room_code} />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <aside className="w-96 max-w-full flex-shrink-0 min-w-0">
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
    </div>
  );
};

export default RoomWorkspace;
