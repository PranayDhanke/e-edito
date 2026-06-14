"use client";

import { roomService } from "@/api/services/roomService";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export interface RoomLogItem {
  _id: string;
  room_code: string;
  user_id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at?: string;
}

export interface RoomLogResponse {
  logs: RoomLogItem[];
  nextCursor: string | null;
  pagination: {
    limit: number;
    hasNextPage: boolean;
  };
}

export const useGetRoomLogs = (roomCode: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["room-logs", roomCode],
    enabled: !!roomCode,
    queryFn: async () => {
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      const response = await roomService.getLogs(token, roomCode);
      return response.data as RoomLogResponse;
    },
  });
};
