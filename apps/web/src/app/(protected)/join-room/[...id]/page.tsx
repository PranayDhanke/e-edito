"use client";

import { roomService } from "@/api/services/roomService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Video, VideoOff, Mic, MicOff, Users } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAddToRoom } from "@/api/hooks/room/addToRoom";

export default function JoinRoomPage() {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const params = useParams();
  const searchParams = useSearchParams();

  const roomCode = Array.isArray(params.id) ? params.id[0] : params.id;
  const role = searchParams.get("role") || "viewer";
  const invitedBy = searchParams.get("invited_by") as string;
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

      if (!res) toast.error("no response");

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
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>You've been invited 🎉</CardTitle>
          <CardDescription>Join the collaborative workspace.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Room Code</p>
            <p className="font-semibold">{roomCode}</p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span>Role</span>
            <Badge>{role}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Invited By</span>
            <span>{invitedBy}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Video</span>

            {video ? (
              <Video className="size-5 text-green-600" />
            ) : (
              <VideoOff className="size-5 text-red-600" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span>Audio</span>

            {audio ? (
              <Mic className="size-5 text-green-600" />
            ) : (
              <MicOff className="size-5 text-red-600" />
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={handleJoin} disabled={isJoining}>
            <Users className="mr-2 size-4" />
            {isJoining ? "Joining..." : "Join Workspace"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
