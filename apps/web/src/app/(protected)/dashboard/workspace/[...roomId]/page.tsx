"use client";

import { useGetRoom } from "@/api/hooks/room/getRoomDetail";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "@/socket/socket-provider";
import { SocketEvent } from "@repo/shared-types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { roomService } from "@/api/services/roomService";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useLeaveRoom } from "@/api/hooks/room/leaveRoom";
import InviteButton from "@/components/rooms/InviteButton";
import { Button } from "@/components/ui/button";
import MonacoEditorComponent from "@/components/rooms/Editor";
import Participant from "@/components/rooms/Participant";
import RoomVersions from "@/components/rooms/RoomVersions";
import RoomActivity from "@/components/rooms/RoomActivity";
import MonacoEditor from "@/components/rooms/Editor";

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

  useEffect(() => {
    if (!socket || !room_code) {
      return;
    }

    socket.emit(SocketEvent.JOIN_ROOM, { room_code, role });

    socket.on(SocketEvent.ERROR, handleSocketError);

    return () => {
      socket.off(SocketEvent.ERROR, handleSocketError);
    };
  }, [handleSocketError, role, room_code, socket]);

  if (isLoading) {
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
      value: `${0}/${data?.maxParticipants || 0}`,
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
        Error loading room
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
    <div>
      <div>
        <h1>Links</h1>
        {data?.owner_id === user?.id ? (
          <InviteButton
            roomCode={room_code}
            userId={data.owner_id}
            audioStatus={data.is_audio_enabled}
            videoStatus={data.is_video_enabled}
          />
        ) : (
          ""
        )}
      </div>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(255,222,156,0.35),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(248,250,252,0.98))] p-4 shadow-[0_32px_120px_-48px_rgba(15,23,42,0.45)] md:p-6">
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(90deg,rgba(249,115,22,0.08),rgba(14,165,233,0.06),rgba(16,185,129,0.06))]" />

        <div className="relative space-y-6">
          <section className="rounded-[2rem] border border-border/60 bg-card/80 p-6 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Room workspace
                </p>
                <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
                  {data?.name}
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                  {data?.description ||
                    "A shared coding room ready for edits, saved versions, and team activity."}
                </p>
              </div>

              <div className="rounded-3xl border border-border/70 bg-background/80 px-4 py-3 text-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Room code
                </p>
                <p className="mt-1 font-mono text-lg font-semibold tracking-[0.18em] text-foreground">
                  {data?.room_code}
                </p>
                <Button
                  className="mt-3 w-full"
                  size="xs"
                  variant="outline"
                  disabled={isLeaving}
                  onClick={handleLeaveRoom}
                >
                  <LogOut className="size-3" />
                  {isLeaving ? "Leaving..." : "Leave Room"}
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-[1.75rem] border border-white/50 bg-gradient-to-br p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.4)]",
                  statCardStyles[index % statCardStyles.length],
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">
                  {stat.label}
                </p>
                <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm opacity-75">{stat.helper}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-border/60 bg-card/85 p-4 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between gap-4 px-2">
                  <div>
                    <h2 className="font-heading text-xl font-semibold">
                      Live editor
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Current room code snapshot.
                    </p>
                  </div>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {data?.language}
                  </span>
                </div>
                <div className="overflow-hidden rounded-[1.5rem] border border-slate-800/70">
                  <MonacoEditor />
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <Participant
                roomCode={room_code}
                currentUserId={user?.id}
                isOwner={data?.owner_id === user?.id}
              />
              <RoomVersions roomCode={room_code} />
              <RoomActivity roomCode={room_code} />
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RoomWorkspace;
