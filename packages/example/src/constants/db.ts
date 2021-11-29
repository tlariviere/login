const config = {
  MONGODB_URL: process.env.MONGODB_URL ?? "mongodb://localhost:27017",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME ?? "app",
  MONGODB_USERNAME: process.env.MONGODB_USERNAME ?? "",
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD ?? "",
};

export default config;
