import { AppError } from "../../../utils/AppError";
import { getUserRepo } from "./user.repository";

//creating a service for the user
export const getUserService = async (userId: string) => {
  //taking the data from the repo
  const data = await getUserRepo(userId);

  if (!data) {
    throw new AppError(501, "error while retriving the data");
  }

  return data;
};
