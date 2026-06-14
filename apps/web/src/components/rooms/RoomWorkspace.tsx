"use client";

import { useGetRoom } from "@/api/hooks/room/getRoomDetail";
import MonacoEditor from "./Editor";
import Participant from "./Participant";
import RoomVersions from "./RoomVersions";
import RoomActivity from "./RoomActivity";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const statCardStyles = [
  "from-[#fff3d6] via-[#fff8ea] to-[#fffef8] text-amber-950",
  "from-[#dff4ff] via-[#eef9ff] to-[#f8fdff] text-sky-950",
  "from-[#e8f7e8] via-[#f2fcf2] to-[#fbfffb] text-emerald-950",
  "from-[#f4ecff] via-[#faf6ff] to-[#fffaff] text-violet-950",
];

const RoomWorkspace = ({ roomCode }: { roomCode: string }) => {
  const { data, isLoading, error } = useGetRoom(roomCode);

  useEffect(() => {
    
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Loading room workspace...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-destructive/30 bg-destructive/5 p-8 text-sm text-destructive">
        Error loading room
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
      value: `${data?.participantCount || 0}/${data?.maxParticipants || 0}`,
      helper: "Live seats in use",
    },
    {
      label: "Visibility",
      value: data?.is_public ? "Public" : "Private",
      helper: "Join access mode",
    },
  ];

  return (
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
                <MonacoEditor
                  code={data?.code || "code ..."}
                  language={data?.language || "javascript"}
                  height="68vh"
                />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <Participant roomCode={roomCode} />
            <RoomVersions roomCode={roomCode} />
            <RoomActivity roomCode={roomCode} />
          </aside>
        </section>
      </div>
    </div>
  );
};

export default RoomWorkspace;
