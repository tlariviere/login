import debugModule from "debug";
import http from "http";
import express from "express";
import logger from "morgan";
import apiRouter from "./api";

import type { NodeError } from "./utils/types";
import exitWithError from "./utils/exitWithError";
import normalizePort from "./utils/normalizePort";
import { isSystemError } from "./utils/types";

const debug = debugModule("login:server");
const port = normalizePort(process.env.PORT || "3000");
const app = express();

app.use(logger("dev"));
app.use("/api", apiRouter);

const server = http.createServer(app);

server.on("error", (error: NodeError) => {
  if (!isSystemError(error) || error.syscall !== "listen") {
    throw error;
  }

  const bind =
    typeof port === "string" ? `Pipe ${port}` : `Port ${port.toString()}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      exitWithError(`${bind} requires elevated privileges`);
      break;
    case "EADDRINUSE":
      exitWithError(`${bind} is already in use`);
      break;
    default:
      throw error;
  }
});

server.on("listening", () => {
  const addr = server.address();
  if (addr === null) {
    return;
  }

  if (typeof addr === "string") {
    debug(`Listening on pipe ${addr}`);
  } else {
    app.set("port", addr.port);
    debug(`Listening on port ${addr.port}`);
  }
});

server.listen(port);
