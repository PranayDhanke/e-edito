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
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="animate-spin w-4 h-4 rounded-full border-2 border-border border-t-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Loading versions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <p className="text-xs text-destructive">Error loading versions</p>
          <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data?.versions?.length) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">No saved versions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3 overflow-y-auto h-full">
        {data?.versions?.map((version) => (
          <article
            key={version._id}
            className="rounded-md border border-border/30 bg-background/60 hover:bg-background/80 transition-colors p-3 text-xs cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground truncate">
                  {version.name}
                </p>
                <p className="text-muted-foreground mt-0.5 line-clamp-1">
                  {version.reason || "No description"}
                </p>
              </div>
              <span className="text-muted-foreground text-xs flex-shrink-0">
                {formatDate(version.created_at)}
              </span>
            </div>
            <div className="mt-1 font-mono text-xs text-muted-foreground truncate">
              {version.code.slice(0, 60)}...
            </div>
          </article>
        ))}
    </div>
  );
};

export default RoomVersions;
