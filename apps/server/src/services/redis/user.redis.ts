import { User } from "@repo/shared-types";
import { redis } from "../../config/redis";
import { getUserService } from "../../modules/auth/user/user.service";

//function to add the user to redis
const addUser = async (user: Partial<User>) => {
  const u = user;

  if (!u._id || !u.name || !u.profile_image) {
    return null;
  }

  //add user to redis
  await redis.hset(`user:${user._id}`, {
    name: u.name,
    _id: u._id,
    profile_image: u.profile_image,
  });

  //expire in 1 hour
  await redis.expire(`user:${user._id}`, 3600);

  return {
    _id: u._id,
    name: u.name,
    profile_image: u.profile_image,
  };
};

//function to add or get the user
const getOrCreateUser = async (userId: string) => {
  //get the user from hash
  const user = await redis.hgetall(`user:${userId}`);

  //check the all fields are > 0 and return
  if (Object.keys(user).length > 0) {
    return {
      _id: userId,
      ...user,
    };
  }

  //else find the user from db and store it
  const userData: User = await getUserService(userId);

  if (!userData) return;

  //add data to the redis
  return await addUser(userData);
};

const updateUser = async (user: Partial<User>) => {
  return await addUser(user);
};

const deleteUser = async (userId: string) => {
  await redis.del(`user:${userId}`);
};

export const redisUserService = {
  addUser,
  getOrCreateUser,
  updateUser,
  deleteUser,
};
