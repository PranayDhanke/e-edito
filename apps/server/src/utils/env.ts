import { config } from "dotenv";
import { z } from "zod";

//injecting all env to the app using the dot env
config();

//creating the schema for the env using zod
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  PORT: z.coerce.number().min(1),

  CLIENT_URL: z.url(),

  MONGODB_URI: z.string().startsWith("mongodb"),

  REDIS_URL: z.string().startsWith("redis"),

  CLERK_SECRET_KEY: z.string().min(20),

  CLERK_WEBHOOK_SECRET: z.string().min(20),

  BULLMQ_PREFIX: z.string().min(1),

  CODE_EXECUTION_URL: z.string(),
});

export const env = envSchema.parse(process.env);
