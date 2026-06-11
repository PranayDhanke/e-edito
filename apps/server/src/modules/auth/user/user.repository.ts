import { User } from "@repo/shared-types";
import { UserModel } from "../clerk.model";

//use repo to the data of the user
export const getUserRepo = async (userId: string) => {
  //taking the data from the mondogb
  const user = await UserModel.findById(userId);

  return user;
};
