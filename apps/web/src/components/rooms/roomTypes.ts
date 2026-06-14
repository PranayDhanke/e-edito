export interface ParticipantUser {
  _id: string;
  name: string;
  profile_image: string;
}

export interface RoomParticipantWithUser {
  _id: string;
  room_code: string;
  user_id: ParticipantUser;
  role: "owner" | "editor" | "viewer";
  invited_by?: string | null;
  invitedBy?: string | null;
  joined_at?: string;
  joinedAt?: string;
}
