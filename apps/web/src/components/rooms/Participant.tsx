"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useGetRoomParticiapnts } from "@/api/hooks/participants/getParticipants";
import { useRemovePatticipant } from "@/api/hooks/participants/removeParticipant";
import { useBanPatticipant } from "@/api/hooks/participants/banParticipant";
import { RoomParticipant } from "@repo/validation";
import { Member, SocketEvent, User } from "@repo/shared-types";
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "@/socket/socket-provider";
import { useRouter } from "next/navigation";

const Participant = ({
  roomCode,
  currentUserId,
  isOwner,
  participants,
}: {
  roomCode: string;
  currentUserId?: string;
  isOwner?: boolean;
  participants: Member[];
}) => {
  const socket = useSocket();
  const [data, setData] = useState<Member[]>([]);
  const { mutateAsync: removeParticipant } = useRemovePatticipant();
  const { mutateAsync: banParticipant } = useBanPatticipant();
  const router = useRouter();

  const handleUserJoin = useCallback(
    (participant: Member) => {
      setData((prev) => {
        if (prev.some((member) => member._id === participant._id)) {
          return prev;
        }

        return [...prev, participant];
      });
    },
    [],
  );

  useEffect(() => {
    if (!participants) return;
    setData(participants);
  }, [participants]);

  const handleUserLeft = useCallback(
    (userId: string) => {
      setData((prev) => prev.filter((member) => member._id !== userId));

      if (currentUserId !== userId) return;

      toast.error("You are kicked");
      router.replace("/dashboard");
    },
    [currentUserId, router],
  );

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEvent.USER_JOINED, handleUserJoin);
    socket.on(SocketEvent.USER_LEFT_RES, handleUserLeft);

    return () => {
      socket.off(SocketEvent.USER_JOINED, handleUserJoin);
      socket.off(SocketEvent.USER_LEFT_RES, handleUserLeft);
    };
  }, [socket, handleUserJoin, handleUserLeft]);

  const handleRemove = async (userId: string) => {
    try {
      await removeParticipant({
        roomCode,
        userId,
      });

      setData((prev) => prev.filter((m) => m._id !== userId));
      socket?.emit(SocketEvent.USER_LEFT, userId);

      toast.success("Participant removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove participant",
      );
    }
  };

  const handleBan = async (userId: string, name: string) => {
    const reason = window.prompt(`Ban ${name}? Enter a reason:`)?.trim();

    if (!reason) return;

    try {
      await banParticipant({
        roomCode,
        userId,
        data: {
          reason,
        },
      });

      setData((prev) => prev.filter((m) => m._id !== userId));
      socket?.emit(SocketEvent.USER_LEFT, userId);

      toast.success("Participant banned");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to ban participant",
      );
    }
  };

  return (
    <div className="space-y-2">
        {data?.map((participant: Member) => {
          const isCurrentUser = currentUserId === participant._id;
          return (
            <div
              key={participant._id}
              className={cn(
                "flex items-center gap-2.5 rounded-md border p-3 group transition-all",
                isCurrentUser ? "border-primary/40 bg-primary/5" : "border-border/30 bg-background/60 hover:bg-background/80"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={participant.profile_image}
                alt={participant.name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-md object-cover ring-1 ring-border/40 flex-shrink-0"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-medium text-foreground">
                    {participant.name}
                  </p>
                  {isCurrentUser && (
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      You
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider inline-block mt-1",
                    participant.role === "owner" && "bg-amber-500/15 text-amber-600",
                    participant.role === "editor" && "bg-blue-500/15 text-blue-600",
                    participant.role === "viewer" && "bg-slate-500/15 text-slate-600",
                  )}
                >
                  {participant.role}
                </span>
              </div>

              {isOwner && !isCurrentUser && participant.role !== "owner" && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(participant._id)}
                    className="h-6 px-2 text-xs"
                  >
                    Remove
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleBan(participant._id, participant.name)
                    }
                    className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                  >
                    Ban
                  </Button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Participant;
