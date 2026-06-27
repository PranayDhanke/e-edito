"use client";

import { participantService } from "@/api/services/participantService";
import { roomService } from "@/api/services/roomService";
import { useAuth } from "@clerk/nextjs";
import { CreateRoomFormInput } from "@repo/validation";
import { useMutation, useQuery } from "@tanstack/react-query";

//creating a hook to create a new room
export const useBanPatticipant = () => {
  const { getToken } = useAuth();

  return useMutation({
    //mutation funcation here we implement fetch functions
    mutationFn: async ({
      roomCode,
      userId,
      data,
    }: {
      roomCode: string;
      userId: string;
      data: {
        reason: string;
        notes?: string | null;
      };
    }) => {
      //first take the token from clerk
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      //calling the room service which has fetch function
      return await participantService.banParticipant(token, roomCode, userId , data);
    },
  });
};
