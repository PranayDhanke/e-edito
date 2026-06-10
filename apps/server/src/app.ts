import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { config } from "./config/config";
import { limiter } from "./utils/limiter";
import { logger } from "./lib/logger";

import { notFoundHandler } from "./middlewares/not-found";
import { errorHandler } from "./middlewares/errorHandler";

import router from "./routes";
import { requestLogger } from "./middlewares/requestLogger";

//create the instance of the express into the app
const app: Express = express();

//disable the x-powered-by for the security
app.disable("x-powered-by");

//adding helmet middleware for security
app.use(helmet());

//adding cors
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);

//adding the body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

//adding the compresser to compress the data
app.use(compression());

//addding the limiter
app.use(limiter);

//adding the logger
app.use(requestLogger);

//adding the `/` route to the server\
app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    service: "E-Editor API",
    version: "v1",
    docs: "/api/v1",
  });
});
//adding the routes
app.use("/api/v1", router);

//adding the middlewares
app.use(notFoundHandler); //not found handler
app.use(errorHandler); // error hander

export default app;
