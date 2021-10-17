const config = {
  /**
   * MongoDB server URI.
   */
  MONGODB_URI: process.env.MONGODB_URL ?? "mongodb://localhost:27017",

  /**
   * MongoDB database name.
   */
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME ?? "app",

  /**
   * MongoDB user name.
   */
  MONGODB_USERNAME: process.env.MONGODB_USERNAME ?? "",

  /**
   * MongoDB password.
   */
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD ?? "",
};

export default config;
