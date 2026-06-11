import { User } from "@repo/shared-types";
import { clerkWebhookRepository } from "./clerk.repository";
import { logger } from "../../../lib/logger";

//serivce function to add new user
export const addClerkUser = async (payload: User) => {
  logger.info({ userId: payload._id }, "Creating clerk user");

  return clerkWebhookRepository.addUser(payload);
};

//serivce function to update user
export const updateClerkUser = async (payload: User) => {
  logger.info({ userId: payload._id }, "Updating clerk user");

  return clerkWebhookRepository.updateUser(payload);
};

//serivce function to delete  user
export const deleteClerkUser = async (clerkId: string) => {
  logger.info({ userId: clerkId }, "Deleting clerk user");

  return clerkWebhookRepository.deleteUser(clerkId);
};
