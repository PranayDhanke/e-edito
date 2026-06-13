import { User } from "@repo/shared-types";
import { UserModel } from "../auth.model";

const addUser = async (payload: User) => {
  return UserModel.create(payload);
};

const updateUser = async (input: User) => {
  return UserModel.findByIdAndUpdate(
    input._id,
    {
      $set: {
        email: input.email,
        name: input.name,
        profile_image: input.profile_image,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

const deleteUser = async (clerkId: string) => {
  return UserModel.findByIdAndDelete(clerkId);
};

export const clerkWebhookRepository = {
  addUser,
  updateUser,
  deleteUser,
};