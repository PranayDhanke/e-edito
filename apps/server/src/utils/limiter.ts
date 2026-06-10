import rateLimit from "express-rate-limit";

//creting a limiter to limit the use
export const limiter = rateLimit({
  //time to remeber the requests
  windowMs: 15 * 60 * 1000,
  //max connection in window time
  max: 200,
});
