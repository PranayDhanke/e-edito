"use client";

import { useGetRoomLogs } from "@/api/hooks/logs/getLogs";
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
import { Copy, Link2, ListFilter, Sparkles, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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

type PanelTab = "invite" | "logs";

export const RoomToolsPanel = ({
  open,
  onClose,
  defaultTab = "invite",
  roomCode,
  userId,
  audioStatus,
  videoStatus,
  isOwner,
}: {
  open: boolean;
  onClose: () => void;
  defaultTab?: PanelTab;
  roomCode: string;
  userId: string;
  audioStatus: boolean;
  videoStatus: boolean;
  isOwner: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<PanelTab>(defaultTab);
  const [limit, setLimit] = useState("10");
  const [actionFilter, setActionFilter] = useState("all");

  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetRoomLogs(roomCode, {
      limit: Number(limit),
    });

  const inviteLink =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/join-room/${roomCode}?role=editor&invited_by=${userId}&video_status=${videoStatus}&audio_status=${audioStatus}`;

  const allLogs = useMemo(
    () => data?.pages.flatMap((page) => page.logs) ?? [],
    [data?.pages],
  );

  const visibleLogs = useMemo(() => {
    if (actionFilter === "all") {
      return allLogs;
    }

    return allLogs.filter((log) => log.action === actionFilter);
  }, [actionFilter, allLogs]);

  const actionOptions = useMemo(() => {
    const uniqueActions = Array.from(new Set(allLogs.map((log) => log.action)));
    return ["all", ...uniqueActions];
  }, [allLogs]);

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied");
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Room tools"
      description="Invite people into the room and review activity without leaving the editor."
      widthClassName="max-w-3xl"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {isOwner ? (
            <Button
              variant={activeTab === "invite" ? "default" : "outline"}
              onClick={() => setActiveTab("invite")}
            >
              <Users className="size-4" />
              Invite
            </Button>
          ) : null}
          <Button
            variant={activeTab === "logs" ? "default" : "outline"}
            onClick={() => setActiveTab("logs")}
          >
            <Sparkles className="size-4" />
            Activity
          </Button>
        </div>

        {activeTab === "invite" && isOwner ? (
          <section className="rounded-[2rem] border border-border/60 bg-card/85 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(14,165,233,0.12))]">
                <Link2 className="size-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-semibold">Invite people</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Pick the access level first, then copy a shareable link for your
                  teammate or candidate.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Invite link
                </label>
                <div className="rounded-[1.5rem] border border-border/60 bg-background/85 p-4">
                  <Input
                    readOnly
                    value={inviteLink}
                    className="truncate border-0 px-0"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={copyInviteLink}>
                    <Copy className="size-4" />
                    Copy link
                  </Button>
                  <p className="text-xs leading-6 text-muted-foreground">
                    Audio: {audioStatus ? "on" : "off"} | Video:{" "}
                    {videoStatus ? "on" : "off"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "logs" ? (
          <section className="space-y-6">
            <div>
              <h3 className="font-heading text-xl font-semibold">Room activity</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Review recent events, moderation actions, and collaboration changes.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-border/60 bg-background/80 p-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground block mb-2">
                    Event type
                  </label>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All events" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionOptions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action === "all"
                            ? "All events"
                            : actionLabelMap[action] || action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground block mb-2">
                    Page size
                  </label>
                  <Select value={limit} onValueChange={setLimit}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 items</SelectItem>
                      <SelectItem value="20">20 items</SelectItem>
                      <SelectItem value="30">30 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-8 text-center text-sm text-muted-foreground">
                  Loading activity...
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-sm text-destructive">
                  {error.message}
                </div>
              ) : null}

              {!isLoading && !error && !visibleLogs.length ? (
                <div className="rounded-2xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
                  No activity matched this filter yet.
                </div>
              ) : null}

              {visibleLogs.map((log) => (
                <div
                  key={log._id}
                  className="rounded-xl border border-border/40 bg-background/60 p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-xs">
                        {actionLabelMap[log.action] || log.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        User: {log.user_id}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDate(log.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {hasNextPage ? (
              <div className="flex justify-center pt-4 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more activity"}
                </Button>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </SlideOver>
  );
};
