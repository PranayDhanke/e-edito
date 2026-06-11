"use client";

import { userService } from "@/api/services/userService";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

//creating a hook to get data from the query
export const useGetMe = () => {
  const { getToken } = useAuth();

  return useQuery({
    //this query ke ast as a cache key to get and save the data
    queryKey: ["me"],

    //queuery funcation here we implement fetch functions
    queryFn: async () => {
      //first take the token from clerk
      const token = await getToken();

      if (!token) {
        throw new Error("Failed to get the token");
      }

      //calling the user service which has fetch function
      return await userService.getMe(token);
    },
  });
};
