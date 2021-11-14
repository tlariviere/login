import http from "http";
import express from "express";
import logger from "morgan";
import helmet from "helmet";
import config from "./constants/server";

import type { NodeError } from "./utils/types";
import apiRouter from "./api";
import exitWithError from "./utils/exitWithError";
import { isSystemError } from "./utils/types";

const app = express();

app.use(logger("dev"));
app.use(helmet());
app.use("/api", apiRouter);

const server = http.createServer(app);

server.on("error", (error: NodeError) => {
  if (!isSystemError(error) || error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      exitWithError(`Port ${config.PORT} requires elevated privileges`);
      break;
    case "EADDRINUSE":
      exitWithError(`Port ${config.PORT} is already in use`);
      break;
    default:
      throw error;
  }
});

server.on("listening", () =>
  console.log(`Server running at http://127.0.0.1:${config.PORT}/`)
);
server.listen(config.PORT);
