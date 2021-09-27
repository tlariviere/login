/* eslint-disable jest/expect-expect */
import express from "express";
import supertest from "supertest";

import asyncHandler from "./asyncHandler";

describe("Async request handler", () => {
  const app = express();
  app.get(
    "/",
    asyncHandler(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error())))
    )
  );

  test("should return status 500 if handler throws", async () => {
    await supertest(app).get("/").expect(500);
  });
});
