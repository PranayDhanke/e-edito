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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

      <div className="mb-6 flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Active workspace
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">
              {data?.name || "Room workspace"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {data?.description || "A shared coding room ready for edits, saved versions, and team activity."}
            </p>
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
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(255,222,156,0.35),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(248,250,252,0.98))] p-4 shadow-[0_32px_120px_-48px_rgba(15,23,42,0.45)] md:p-6">
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(90deg,rgba(249,115,22,0.08),rgba(14,165,233,0.06),rgba(16,185,129,0.06))]" />

        <div className="relative space-y-6">
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-[1.75rem] border border-white/50 bg-gradient-to-br p-4 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.4)]",
                  statCardStyles[index % statCardStyles.length],
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">
                  {stat.label}
                </p>
                <p className="mt-2 text-xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-xs opacity-75">{stat.helper}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_380px] min-h-[600px]">
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-border/60 bg-card/85 p-4 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.4)] backdrop-blur h-full flex flex-col">
                <div className="mb-4 flex items-center justify-between gap-4 px-2">
                  <div>
                    <h2 className="font-heading text-lg font-semibold">
                      Live editor
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {data?.language} • Real-time collaboration
                    </p>
                  </div>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {data?.language}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden rounded-[1.5rem] border border-slate-800/70 min-h-0">
                  {!initialCode ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Loading editor...
                    </div>
                  ) : (
                    <MonacoEditor initialCode={initialCode} />
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-border/60 bg-card/85 p-4 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
                <div className="mb-4 px-2">
                  <h2 className="font-heading text-lg font-semibold">
                    Version history
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Recent saved states
                  </p>
                </div>
                <RoomVersions roomCode={room_code} />
              </div>
            </div>

            <aside className="min-h-0">
              <WorkspacePanel
                roomCode={room_code}
                currentUserId={user?.id}
                isOwner={data?.owner_id === user?.id}
                participants={participants}
                isAudioEnabled={data?.is_audio_enabled}
                isVideoEnabled={data?.is_video_enabled}
              />
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RoomWorkspace;
