"use client";

import { roomService } from "@/api/services/roomService";
import { useAuth } from "@clerk/nextjs";
import { RoomFilters } from "@repo/shared-types";
import { useInfiniteQuery } from "@tanstack/react-query";

//creating a hook to get data from the query
export const useGetMyRoom = (filters: Omit<RoomFilters, "cursor">) => {
  const { getToken } = useAuth();

  return useInfiniteQuery({
    queryKey: [
      "rooms",
      filters.limit ?? 10,
      filters.search ?? "",
      filters.status ?? "all",
      filters.language ?? "all",
    ],
    initialPageParam: undefined as string | undefined,

    queryFn: async ({ pageParam }) => {
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      const rooms = await roomService.getMyRoom(token, {
        ...filters,
        cursor: pageParam,
      });

      return rooms.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
};
