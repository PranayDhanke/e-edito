"use client";
import { versionService } from "@/api/services/versionService";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export interface RoomVersionItem {
  _id: string;
  room_code: string;
  name: string;
  code: string;
  saved_by: string;
  language: string;
  reason: string;
  created_at?: string;
}

export interface RoomVersionResponse {
  versions: RoomVersionItem[];
  nextCursor: string | null;
  pagination: {
    limit: number;
    hasNextPage: boolean;
  };
}

export const useGetRoomVersions = (roomCode: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["room-versions", roomCode],
    enabled: !!roomCode,
    queryFn: async () => {
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      const response = await versionService.getVersions(token, roomCode);
      return response.data as RoomVersionResponse;
    },
  });
};
