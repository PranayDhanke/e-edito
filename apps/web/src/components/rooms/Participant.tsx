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
    <section className="rounded-[2rem] border border-border/60 bg-card/85 p-5 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold">Participants</h2>
          <p className="text-sm text-muted-foreground">
            Everyone in this room.
          </p>
        </div>

        <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          {data?.length ?? 0} members
        </span>
      </div>

      <div className="space-y-3">
        {data?.map((participant: Member) => {
          return (
            <div
              key={participant._id}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={participant.profile_image}
                alt={participant.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-2xl object-cover ring-1 ring-border/60"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {participant.name}
                </p>
              </div>

              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                  participant.role === "owner" &&
                    "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
                  participant.role === "editor" &&
                    "bg-sky-100 text-sky-800 ring-1 ring-sky-200",
                  participant.role === "viewer" &&
                    "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
                )}
              >
                {participant.role}
              </span>

              {isOwner &&
                currentUserId !== participant._id &&
                participant.role !== "owner" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleRemove(participant._id)}
                    >
                      Remove
                    </Button>

                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() =>
                        handleBan(participant._id, participant.name)
                      }
                    >
                      Ban
                    </Button>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Participant;
