"use client";

import { roomService } from "@/api/services/roomService";
import { useAuth } from "@clerk/nextjs";
import { CreateRoomFormInput } from "@repo/validation";
import { useMutation, useQuery } from "@tanstack/react-query";

//creating a hook to create a new room
export const useAddToRoom = () => {
  const { getToken } = useAuth();

  return useMutation({
    //mutation funcation here we implement fetch functions
    mutationFn: async ({
      roomCode,
      role,
      invitedBy,
    }: {
      roomCode: string;
      role: string;
      invitedBy: string;
    }) => {
      //first take the token from clerk
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      //calling the room service which has fetch function
      return await roomService.joinRoom(token, roomCode, role, invitedBy);
    },
  });
};
