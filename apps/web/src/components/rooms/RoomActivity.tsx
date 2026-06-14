"use client";

import { useGetRoomLogs } from "@/api/hooks/room/getLogs";

const actionLabelMap: Record<string, string> = {
  ROOM_CREATED: "Room created",
  USER_JOINED: "User joined",
  USER_LEFT: "User left",
  VERSION_CREATED: "Version created",
  PARTICIPANT_REMOVED: "Participant removed",
  PARTICIPANT_ROLE_CHANGED: "Role updated",
  USER_BANNED: "User banned",
  MESSAGE_CREATED: "Message sent",
  CODE_UPDATED: "Code updated",
  CODE_SAVED: "Code saved",
  ROOM_CLOSED: "Room closed",
};

const formatDate = (value?: string) => {
  if (!value) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const RoomActivity = ({ roomCode }: { roomCode: string }) => {
  const { data, isLoading, error } = useGetRoomLogs(roomCode);

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-border/60 bg-card/85 p-5">
        <p className="text-sm text-muted-foreground">Loading activity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
        {error.message}
      </div>
    );
  }

  return (
    <section className="rounded-[2rem] border border-border/60 bg-card/85 p-5 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
      <div className="mb-4">
        <h2 className="font-heading text-xl font-semibold">Activity</h2>
        <p className="text-sm text-muted-foreground">
          The latest room events and collaboration actions.
        </p>
      </div>

      <div className="space-y-3">
        {data?.logs?.map((log) => (
          <div
            key={log._id}
            className="rounded-2xl border border-border/60 bg-background/85 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {actionLabelMap[log.action] || log.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  User: {log.user_id}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(log.created_at)}
              </span>
            </div>
          </div>
        ))}

        {!data?.logs?.length && (
          <div className="rounded-2xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
            No room activity yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomActivity;
