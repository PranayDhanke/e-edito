"use client";

import { useGetMyRoom } from "@/api/hooks/room/getMyRoom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlideOver } from "@/components/ui/slide-over";
import { cn } from "@/lib/utils";
import { Room } from "@repo/validation";
import {
  ArrowRight,
  Code2,
  Filter,
  Lock,
  Mic,
  Plus,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

const dashboardCardStyles = [
  "from-[#fff5da] via-[#fff8e8] to-[#fffdf6]",
  "from-[#e4f6ff] via-[#eefaff] to-[#f8fdff]",
  "from-[#e9f9ef] via-[#f2fcf6] to-[#fbfffd]",
  "from-[#f7edff] via-[#fbf7ff] to-[#fffaff]",
];

const roomStatusTone: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
  inactive: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  closed: "bg-rose-100 text-rose-800 ring-1 ring-rose-200",
};

const DashboardPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [language, setLanguage] = useState("all");
  const [limit, setLimit] = useState("10");
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetMyRoom({
      search: deferredSearch,
      status,
      language,
      limit: Number(limit),
    });

  const rooms = useMemo(
    () => (data?.pages.flatMap((page) => page.rooms) ?? []) as Room[],
    [data?.pages],
  );

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full rounded-[2rem] border border-border/60 bg-card/80 p-10 text-sm text-muted-foreground shadow-sm">
          Loading your rooms...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full rounded-[2rem] border border-destructive/30 bg-destructive/5 p-10 text-sm text-destructive">
          {error.message}
        </div>
      </div>
    );
  }

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setLanguage("all");
    setLimit("10");
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-lg border border-border/40 bg-gradient-to-br from-background/80 via-background to-background/95 p-6 shadow-sm md:p-8">
        <div className="relative">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
              <Sparkles className="size-3" />
              Rooms
            </div>
            <h1 className="mt-4 font-heading text-3xl font-semibold text-foreground md:text-4xl">
              Collaborative Code Spaces
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Create focused rooms for pair programming, interviews, and code reviews. Invite collaborators and code together in real-time.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/dashboard/create-room">
                <Plus className="size-4" />
                Create Room
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-3 sm:w-auto">
              <div className="rounded-lg border border-border/40 bg-background/60 p-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Rooms
                </p>
                <p className="mt-1.5 text-xl font-semibold text-foreground">
                  {rooms.length}
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 p-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Active
                </p>
                <p className="mt-1.5 text-xl font-semibold text-foreground">
                  {rooms.filter((room) => room.status === "active").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-6">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Rooms
            </p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Pick up where you left off
            </h2>
          </div>

          <div className="rounded-lg border border-border/40 bg-background/60 p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Search
                </label>
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Room name"
                  className="w-full text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="All languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Per Page
                </label>
                <Select value={limit} onValueChange={setLimit}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 rooms</SelectItem>
                    <SelectItem value="20">20 rooms</SelectItem>
                    <SelectItem value="30">30 rooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full text-sm"
              >
                <Filter className="size-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 bg-background/40 p-8 text-center shadow-sm">
            <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-accent/10">
              <Code2 className="size-5 text-accent" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">
              No rooms yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Create your first collaborative coding room to get started
            </p>
            <Button className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground" size="sm" asChild>
              <Link href="/dashboard/create-room">
                <Plus className="size-4" />
                Create First Room
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {rooms.map((room) => (
              <article
                key={room._id}
                className="rounded-lg border border-border/40 bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-4">
                  {/* Header with badges */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={cn(
                            "rounded-md px-2.5 py-1 text-xs font-semibold",
                            roomStatusTone[room.status] ||
                              "bg-muted text-muted-foreground",
                          )}
                        >
                          {room.status}
                        </span>
                        <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-accent/10 text-accent">
                          {room.language}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground truncate">
                        {room.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {room.description || "No description"}
                      </p>
                    </div>

                    {/* Room code box */}
                    <div className="rounded-md border border-border/40 bg-background/60 px-3 py-2 text-xs flex-shrink-0">
                      <p className="text-muted-foreground font-medium">Code</p>
                      <p className="font-mono text-sm font-semibold mt-0.5">
                        {room.room_code}
                      </p>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-border/30 bg-background/40 p-2">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="size-3" />
                        <span className="text-xs">Seats</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {room.participantCount}/{room.maxParticipants}
                      </p>
                    </div>
                    <div className="rounded-md border border-border/30 bg-background/40 p-2">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Lock className="size-3" />
                        <span className="text-xs">Access</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {room.is_public ? "Public" : "Private"}
                      </p>
                    </div>
                    <div className="rounded-md border border-border/30 bg-background/40 p-2">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mic className="size-3" />
                        <span className="text-xs">Audio</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {room.is_audio_enabled ? "On" : "Off"}
                      </p>
                    </div>
                    <div className="rounded-md border border-border/30 bg-background/40 p-2">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Video className="size-3" />
                        <span className="text-xs">Video</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {room.is_video_enabled ? "On" : "Off"}
                      </p>
                    </div>
                  </div>

                  {/* Action button */}
                  <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href={`/dashboard/workspace/${room.room_code}?role=owner`}>
                      <ArrowRight className="size-3.5" />
                      Open Room
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {rooms.length > 0 ? (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              disabled={!hasNextPage || isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                  ? "Load more rooms"
                  : "No more rooms"}
            </Button>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default DashboardPage;
