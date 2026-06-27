"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";

const InviteButton = ({
  roomCode,
  userId,
  videoStatus,
  audioStatus,
}: {
  roomCode: string;
  userId: string;
  videoStatus: boolean;
  audioStatus: boolean;
}) => {
  const [role, setRole] = useState("");

  const inviteLink = `${window.location.origin}/join-room/${roomCode}?role=${role}&invited_by=${userId}&video_status=${videoStatus}&audio_status=${audioStatus}`;

  const copy = async () => {
    await navigator.clipboard.writeText(inviteLink);

    toast.success("Invite Link Copied");
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Invite User</CardTitle>
        <CardDescription>
          Choose a role and copy the invite link.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Role</Label>

          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Invite Link</Label>

          <Input
            readOnly
            value={role ? inviteLink : ""}
            placeholder="Select a role to generate a link"
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" disabled={!role} onClick={copy}>
          Copy Invite Link
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InviteButton;
