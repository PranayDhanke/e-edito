"use client";

import { roomService } from "@/api/services/roomService";
import { useAuth } from "@clerk/nextjs";
import { Room } from "@repo/validation";
import { useQuery } from "@tanstack/react-query";

//creating a hook to get data from the query
export const useGetRoom = (roomCode: string) => {
  const { getToken } = useAuth();

  return useQuery({
    //this query ke ast as a cache key to get and save the data
    queryKey: ["room", roomCode],
    enabled: !!roomCode,

    //queuery funcation here we implement fetch functions
    queryFn: async () => {
      //first take the token from clerk
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      const data = await roomService.getRoom(token, roomCode);

      //calling the user service which has fetch function
      return (await data.data) as Room;
    },
  });
};
