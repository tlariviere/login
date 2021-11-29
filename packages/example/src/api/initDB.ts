import mongoose from "mongoose";

import exitWithError from "../utils/exitWithError";
import config from "../constants/db";

(async () => {
  const handleError = (err: Error) =>
    exitWithError(
      `Failed to connect to '${config.MONGODB_URL}/${config.MONGODB_DB_NAME}': ${err.message}`
    );

  let auth;
  if (config.MONGODB_USERNAME && config.MONGODB_PASSWORD) {
    auth = {
      username: config.MONGODB_USERNAME,
      password: config.MONGODB_PASSWORD,
    };
  }

  try {
    await mongoose.connect(config.MONGODB_URL, {
      dbName: config.MONGODB_DB_NAME,
      auth,
    });
  } catch (err) {
    handleError(err as Error);
  }

  mongoose.connection.on("error", (err: Error) => handleError(err));
  mongoose.connection.on(
    "connected",
    () =>
      `Connected to mongoDB server at '${config.MONGODB_URL}/${config.MONGODB_DB_NAME}'`
  );
  mongoose.connection.on(
    "disconnected",
    () => "Disconnected from mongoDB server"
  );
})();
