import type { Response } from "express";

import type { Request } from "../../utils/types";
import type TokenFamilies from "../TokenFamilies";
import MockTockenFamily from "../utils/testing/MockTokenFamily";
import MockTokenFamilies from "../utils/testing/MockTokenFamilies";
import MockResponse from "../utils/testing/MockResponse";
import refresh from "./refresh";

describe("Auth router token refresh", () => {
  type Roles = string;
  const accessToken = "access";
  const refreshToken = "refresh";
  const tokenFamily = new MockTockenFamily(accessToken, refreshToken);
  const tokenFamilies = new MockTokenFamilies(tokenFamily);
  const cookieOptions = { secure: false, httpOnly: true, sameSite: true };
  const handler = refresh(
    tokenFamilies as unknown as TokenFamilies<Roles>,
    cookieOptions
  );
  const res = new MockResponse();
  const next = jest.fn();

  beforeAll(() => {
    tokenFamilies.mockVerifyRefreshToken("foo");
  });

  beforeEach(() => {
    res.mockClear();
  });

  test("should fail on missing refresh_token cookie", async () => {
    const req = { cookies: {} } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(401);
  });

  test("should fail on invalid refresh token", async () => {
    const req = {
      cookies: { refresh_token: refreshToken },
    } as unknown as Request;
    const errorMsg = "bar";
    tokenFamilies.mockVerifyRefreshTokenOnce(new Error(errorMsg));
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(401);
    expect(res.send).toHaveBeenCalledWith(errorMsg);
  });

  test("should return status 200 on success", async () => {
    const req = {
      cookies: { refresh_token: refreshToken },
    } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(200);
  });

  test("should set access and refresh token as cookies", async () => {
    const req = {
      cookies: { refresh_token: refreshToken },
    } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.cookie).toHaveBeenCalledWith(
      "access_token",
      accessToken,
      cookieOptions
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "refresh_token",
      refreshToken,
      cookieOptions
    );
  });
});
