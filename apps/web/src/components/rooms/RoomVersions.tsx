"use client";

import { useGetRoomVersions } from "@/api/hooks/version/getVersions";

const formatDate = (value?: string) => {
  if (!value) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const RoomVersions = ({ roomCode }: { roomCode: string }) => {
  const { data, isLoading, error } = useGetRoomVersions(roomCode);

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-border/60 bg-card/85 p-5">
        <p className="text-sm text-muted-foreground">Loading versions...</p>
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
        <h2 className="font-heading text-xl font-semibold">Version history</h2>
        <p className="text-sm text-muted-foreground">
          Recent saved states for this room.
        </p>
      </div>

      <div className="space-y-3">
        {data?.versions?.map((version) => (
          <article
            key={version._id}
            className="rounded-2xl border border-border/60 bg-background/85 p-4"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {version.name}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {version.language}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(version.created_at)}
              </span>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              {version.reason || "No reason provided"}
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-950 px-3 py-2 text-xs text-slate-100">
              <code>{version.code.slice(0, 160) || "// Empty version snapshot"}</code>
            </pre>
          </article>
        ))}

        {!data?.versions?.length && (
          <div className="rounded-2xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
            No saved versions yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomVersions;
