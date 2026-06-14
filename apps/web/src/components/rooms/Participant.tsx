"use client";

import { useGetRoomParticiapnts } from "@/api/hooks/room/getParticipants";
import { cn } from "@/lib/utils";

const Participant = ({ roomCode }: { roomCode: string }) => {
  const { data, error, isLoading } = useGetRoomParticiapnts(roomCode);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Loading participants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
        {error.message}
      </div>
    );
  }

  return (
    <section className="rounded-[2rem] border border-border/60 bg-card/85 p-5 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold">Participants</h2>
          <p className="text-sm text-muted-foreground">
            Everyone currently inside this room.
          </p>
        </div>
        <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          {data?.length ?? 0} active
        </span>
      </div>

      <div className="space-y-3">
        {data?.map((participant) => (
          <div
            key={participant._id}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={participant.user_id.profile_image}
              alt={participant.user_id.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-2xl object-cover ring-1 ring-border/60"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {participant.user_id.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {participant.invited_by || participant.invitedBy
                  ? `Invited by ${participant.invited_by || participant.invitedBy}`
                  : "Joined directly"}
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
          </div>
        ))}

        {!data?.length && (
          <div className="rounded-2xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
            No participants have joined this room yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default Participant;
