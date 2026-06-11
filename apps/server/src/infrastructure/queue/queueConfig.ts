export const QueueJobOptions = {
  attempts: 5,

  backoff: {
    type: "exponential" as const,
    delay: 3000,
  },

  removeOnComplete: {
    age: 3600,
    count: 1000,
  },

  removeOnFail: {
    age: 24 * 3600,
  },
};
