"use client";

import { useAddToRoom } from "@/api/hooks/room/addToRoom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, ShieldCheck, Users, Video, VideoOff } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function JoinRoomPage() {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const params = useParams();
  const searchParams = useSearchParams();

  const roomCode = Array.isArray(params.id) ? params.id[0] : params.id;
  const role = searchParams.get("role") || "viewer";
  const invitedBy = searchParams.get("invited_by") || "A teammate";
  const video = searchParams.get("video_status") === "true";
  const audio = searchParams.get("audio_status") === "true";

  const { mutateAsync } = useAddToRoom();

  const handleJoin = async () => {
    if (!roomCode || isJoining) {
      return;
    }

    setIsJoining(true);

    try {
      const res = await mutateAsync({ roomCode, role, invitedBy });

      if (!res) {
        toast.error("No response received");
      }

      toast.success("Joined workspace");
      router.push(`/dashboard/workspace/${roomCode}?role=${role}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to join room";

      if (message.toLowerCase().includes("already joined")) {
        router.push(`/dashboard/workspace/${roomCode}?role=${role}`);
        return;
      }

      toast.error(message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.8fr)]">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] p-8 shadow-[0_32px_120px_-48px_rgba(15,23,42,0.45)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Invitation
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-foreground">
            Your workspace is ready.
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
            You&apos;ve been invited into a collaborative coding room. Review the
            access details, then join when you&apos;re ready.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-border/60 bg-card/75 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Room code
              </p>
              <p className="mt-3 font-mono text-2xl font-semibold tracking-[0.18em] text-foreground">
                {roomCode}
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-border/60 bg-card/75 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Invited by
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {invitedBy}
              </p>
            </div>
          </div>
        </section>

        <Card className="rounded-[2.5rem] border border-border/60 bg-card/85 py-0 shadow-[0_24px_90px_-48px_rgba(15,23,42,0.45)]">
          <CardHeader className="border-b border-border/60 py-8">
            <CardTitle className="normal-case tracking-normal text-2xl">
              Join this room
            </CardTitle>
            <CardDescription>
              Confirm your role and session capabilities before entering.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 py-8">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge className="rounded-full px-3 py-1">{role}</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Moderation</span>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="size-4 text-emerald-600" />
                Managed room
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Video</span>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                {video ? (
                  <>
                    <Video className="size-4 text-sky-600" />
                    Enabled
                  </>
                ) : (
                  <>
                    <VideoOff className="size-4 text-slate-500" />
                    Disabled
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Audio</span>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                {audio ? (
                  <>
                    <Mic className="size-4 text-emerald-600" />
                    Enabled
                  </>
                ) : (
                  <>
                    <MicOff className="size-4 text-slate-500" />
                    Disabled
                  </>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/60 py-6">
            <Button className="w-full" size="lg" onClick={handleJoin} disabled={isJoining}>
              <Users className="size-4" />
              {isJoining ? "Joining..." : "Join workspace"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
