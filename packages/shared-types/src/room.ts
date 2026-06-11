export interface Room {
  _id: string;

  room_code: string;
  name: string;
  description: string;

  owner_id: string;

  language: string;
  code: string;

  is_public: boolean;

  is_audio_enabled: boolean;
  is_video_enabled: boolean;

  status: string;

  maxParticipants: number;

  created_at: Date;
  updated_at: Date;
}
