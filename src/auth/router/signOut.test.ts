import type { Response } from "express";

import type { Request } from "../../utils/types";
import type TokenFamilies from "../TokenFamilies";
import MockTockenFamily from "../testingUtils/MockTokenFamily";
import MockTokenFamilies from "../testingUtils/MockTokenFamilies";
import MockResponse from "../testingUtils/MockResponse";
import signOut from "./signOut";

describe("Auth router sign-out", () => {
  type Roles = string;
  const tokenFamily = new MockTockenFamily();
  const tokenFamilies = new MockTokenFamilies(tokenFamily);
  const cookieOptions = { secure: false, httpOnly: true, sameSite: true };
  const handler = signOut(
    tokenFamilies as unknown as TokenFamilies<Roles>,
    cookieOptions
  );
  const res = new MockResponse();
  const next = jest.fn();
  const user = { id: "01234" };

  beforeEach(() => {
    tokenFamily.mockClear();
    res.mockClear();
  });

  test("should fail if user is not signed in", async () => {
    const req = { cookies: {} } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(401);
  });

  test("should return status 200 on success", async () => {
    const req = { user } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(200);
  });

  test("should clear access and refresh cookies", async () => {
    const req = { user } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.clearCookie).toHaveBeenCalledWith("access_token", cookieOptions);
    expect(res.clearCookie).toHaveBeenCalledWith(
      "refresh_token",
      cookieOptions
    );
  });

  test("should invalidate token family", async () => {
    const req = { user } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(tokenFamily.invalidate).toHaveBeenCalledTimes(1);
  });
});
