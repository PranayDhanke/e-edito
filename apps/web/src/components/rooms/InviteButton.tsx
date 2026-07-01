"use client";

import { Button } from "../ui/button";
import { UserRoundPlus } from "lucide-react";

const InviteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick}>
      <UserRoundPlus className="size-4" />
      Invite & activity
    </Button>
  );
};

export default InviteButton;
