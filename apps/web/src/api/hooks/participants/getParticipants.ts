"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { RoomParticipantWithUser } from "@/components/rooms/roomTypes";
import { participantService } from "@/api/services/participantService";

//creating a hook to get data from the query
export const useGetRoomParticiapnts = (roomCode: string) => {
  const { getToken } = useAuth();

  return useQuery({
    //this query ke ast as a cache key to get and save the data
    queryKey: ["participants", roomCode],
    enabled: !!roomCode,

    //queuery funcation here we implement fetch functions
    queryFn: async () => {
      //first take the token from clerk
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      const data = await participantService.getParticipants(token, roomCode);

      //calling the user service which has fetch function
      return data.data as RoomParticipantWithUser[];
    },
  });
};
