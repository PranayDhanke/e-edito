"use client";

import { Button } from "../ui/button";
import { UserRoundPlus } from "lucide-react";

const InviteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick} size="sm" variant="default">
      <UserRoundPlus className="size-3.5" />
      Invite
    </Button>
  );
};

export default InviteButton;
