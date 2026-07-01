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
      <section className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] p-6 shadow-[0_32px_120px_-48px_rgba(15,23,42,0.45)] md:p-8">
        <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(90deg,rgba(249,115,22,0.08),rgba(14,165,233,0.07),rgba(16,185,129,0.07))]" />

        <div className="relative">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
              <Sparkles className="size-3.5" />
              Workspace control center
            </div>
            <h1 className="mt-5 font-heading text-4xl font-semibold text-foreground md:text-5xl">
              Build rooms that are ready for real collaboration.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Launch a focused coding room, invite people with the right access,
              and jump back into active sessions without hunting for links.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/dashboard/create-room">
                  <Plus className="size-4" />
                  Create a room
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-3 sm:w-auto">
                <div className="rounded-2xl border border-border/60 bg-background/75 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Total
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {rooms.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/75 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Live
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {rooms.filter((room) => room.status === "active").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Your rooms
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground">
                Pick up where you left off
              </h2>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/60 bg-card/85 p-4 backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Search
                </label>
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by room name"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
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

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
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

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Page size
                </label>
                <Select value={limit} onValueChange={setLimit}>
                  <SelectTrigger className="w-full">
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
                className="w-full"
              >
                <Filter className="size-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border/80 bg-card/60 p-10 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(14,165,233,0.12))]">
              <Code2 className="size-6 text-foreground" />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-semibold">
              No rooms yet
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              Start with one polished workspace for your next pair-programming
              session, interview, or review.
            </p>
            <Button className="mt-6" size="lg" asChild>
              <Link href="/dashboard/create-room">
                Create your first room
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {rooms.map((room, index) => (
              <article
                key={room._id}
                className={cn(
                  "rounded-[2rem] border border-white/60 bg-gradient-to-br p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.42)]",
                  dashboardCardStyles[index % dashboardCardStyles.length],
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                          roomStatusTone[room.status] ||
                            "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
                        )}
                      >
                        {room.status}
                      </span>
                      <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                        {room.language}
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-2xl font-semibold text-slate-950">
                      {room.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700/80">
                      {room.description || "No description provided yet."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Room code
                    </p>
                    <p className="mt-2 font-mono text-lg font-semibold tracking-[0.18em]">
                      {room.room_code}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-black/10 bg-white/65 p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="size-4" />
                      <span className="text-xs uppercase tracking-[0.18em]">
                        Seats
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {room.participantCount}/{room.maxParticipants}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/65 p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Lock className="size-4" />
                      <span className="text-xs uppercase tracking-[0.18em]">
                        Access
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {room.is_public ? "Public" : "Private"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/65 p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mic className="size-4" />
                      <span className="text-xs uppercase tracking-[0.18em]">
                        Audio
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {room.is_audio_enabled ? "On" : "Off"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/65 p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Video className="size-4" />
                      <span className="text-xs uppercase tracking-[0.18em]">
                        Video
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {room.is_video_enabled ? "On" : "Off"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Ready for the next session
                  </p>
                  <Button asChild>
                    <Link href={`/dashboard/workspace/${room.room_code}?role=owner`}>
                      Open room
                      <ArrowRight className="size-4" />
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
