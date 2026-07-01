"use client";

import { logService } from "@/api/services/logsService";
import { useAuth } from "@clerk/nextjs";
import { cursorFilters } from "@repo/shared-types";
import { useInfiniteQuery } from "@tanstack/react-query";

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

export const useGetRoomLogs = (
  roomCode: string,
  filters: Omit<cursorFilters, "cursor">,
) => {
  const { getToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ["room-logs", roomCode, filters.limit ?? 20],
    enabled: !!roomCode,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      const response = await logService.getLogs(token, roomCode, {
        ...filters,
        cursor: pageParam,
      });

      return response.data as RoomLogResponse;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
};
