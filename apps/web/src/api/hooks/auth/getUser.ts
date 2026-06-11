"use client";

import { userService } from "@/api/services/userService";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";

//creating a hook to get data from the query
export const useGetUser = () => {
  const { getToken } = useAuth();

  return useMutation({
    //this query ke ast as a cache key to get and save the data

    //queuery funcation here we implement fetch functions
    mutationFn: async (userId: string) => {
      //first take the token from clerk
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      //calling the user service which has fetch function
      return userService.getUser(token, userId);
    },
  });
};
