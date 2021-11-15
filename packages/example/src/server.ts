import path from "path";
import http from "http";
import express from "express";
import logger from "morgan";
import helmet from "helmet";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import config from "./constants/server";

import type { NodeError } from "./utils/types";
import webpackConfig from "./webpack.config";
import apiRouter from "./api";
import exitWithError from "./utils/exitWithError";
import { isSystemError } from "./utils/types";

const app = express();

app.use(logger("dev"));
app.use(helmet());
app.use("/api", apiRouter);

const pages = [
  "/user",
];

app.get(pages, (req, res, next) => {
  req.url = "/"; // react-router requires to serve index.html on any page route.
  next();
});

if (process.env.NODE_ENV === "development") {
  const compiler = webpack(webpackConfig as webpack.Configuration);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    })
  );
} else {
  app.get("/*", express.static(path.join(__dirname, "public")));
}

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
