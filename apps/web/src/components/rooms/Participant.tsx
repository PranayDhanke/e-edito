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
          return (
            <div
              key={participant._id}
              className="flex items-center gap-2 rounded-lg border border-border/40 bg-background/60 p-2.5 group hover:bg-background/80 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={participant.profile_image}
                alt={participant.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover ring-1 ring-border/40 flex-shrink-0"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {participant.name}
                </p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] inline-block mt-0.5",
                    participant.role === "owner" &&
                      "bg-amber-100/80 text-amber-700",
                    participant.role === "editor" &&
                      "bg-sky-100/80 text-sky-700",
                    participant.role === "viewer" &&
                      "bg-slate-100/80 text-slate-700",
                  )}
                >
                  {participant.role}
                </span>
              </div>

              {isOwner &&
                currentUserId !== participant._id &&
                participant.role !== "owner" && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleRemove(participant._id)}
                      className="h-7 px-2"
                    >
                      Remove
                    </Button>

                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() =>
                        handleBan(participant._id, participant.name)
                      }
                      className="h-7 px-2"
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
