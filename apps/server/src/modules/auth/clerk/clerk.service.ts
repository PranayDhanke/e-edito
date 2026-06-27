import { User } from "@repo/shared-types";
import { clerkWebhookRepository } from "./clerk.repository";
import { logger } from "../../../lib/logger";
import { redisUserService } from "../../../services/redis/user.redis";

//serivce function to add new user
export const addClerkUser = async (payload: User) => {
  logger.info({ userId: payload._id }, "Creating clerk user");

  const clerkUser = await clerkWebhookRepository.addUser(payload);

  await redisUserService.addUser(payload);

  return clerkUser;
};

//serivce function to update user
export const updateClerkUser = async (payload: User) => {
  logger.info({ userId: payload._id }, "Updating clerk user");

  const clerkUser = await clerkWebhookRepository.updateUser(payload);

  await redisUserService.updateUser(payload);

  return clerkUser;
};

//serivce function to delete  user
export const deleteClerkUser = async (clerkId: string) => {
  logger.info({ userId: clerkId }, "Deleting clerk user");

  const clerkUser = clerkWebhookRepository.deleteUser(clerkId);

  await redisUserService.deleteUser(clerkId);
  
  return clerkUser;
};
