//creating a service for the user

import { AppError } from "../../../utils/AppError";
import { getUserRepo } from "./user.repository";

export const getUserService = async (userId: string) => {
  const data = await getUserRepo(userId);

  if (!data) {
    throw new AppError(501, "error while retriving the data");
  }

  return data;
};
