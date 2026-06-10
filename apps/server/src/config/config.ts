import { env } from "../utils/env";

//creating the config mapping to use in the server
export const config = {
  env: env.NODE_ENV,

  port: env.PORT,

  clientUrl: env.CLIENT_URL,

  mongodbUri: env.MONGODB_URI,

  redisUrl: env.REDIS_URL,

  clerkSecretKey: env.CLERK_SECRET_KEY,

  clerkWebhookSecret: env.CLERK_WEBHOOK_SECRET,

  bullmqPrefix: env.BULLMQ_PREFIX,

  codeExecutionUrl: env.CODE_EXECUTION_URL,
};
