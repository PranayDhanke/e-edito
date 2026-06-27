"use client";

import { roomService } from "@/api/services/roomService";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

//creating a hook to get data from the query
export const useGetMyRoom = () => {
  const { getToken } = useAuth();

  return useQuery({
    //this query ke ast as a cache key to get and save the data
    queryKey: ["rooms"],

    //queuery funcation here we implement fetch functions
    queryFn: async () => {
      //first take the token from clerk
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      //calling the user service which has fetch function
      const rooms = await roomService.getMyRoom(token);

      return rooms.data;
    },
  });
};
