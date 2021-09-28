import type { Response } from "express";

import type { Request } from "../utils/types";
import type TokenFamilies from "./TokenFamilies";
import MockTockenFamily from "./testingUtils/MockTokenFamily";
import MockTokenFamilies from "./testingUtils/MockTokenFamilies";
import MockResponse from "./testingUtils/MockResponse";
import requireLogin from "./requireLogin";

describe("Require login middleware", () => {
  type Roles = string;
  const accessToken = "access";
  const tokenFamily = new MockTockenFamily(accessToken, "refresh");
  const tokenFamilies = new MockTokenFamilies(tokenFamily);
  const handler = requireLogin(
    tokenFamilies as unknown as TokenFamilies<Roles>
  );
  const res = new MockResponse();
  const next = jest.fn();
  const user = { id: "01234", role: "user" };

  beforeAll(() => {
    tokenFamilies.mockVerifyAccessToken(user.id, user.role);
  });

  beforeEach(() => {
    res.mockClear();
    next.mockClear();
  });

  test("should fail on missing access token cookie", async () => {
    const req = { cookies: {} } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(401);
  });

  test("should call next if request field user already exists", async () => {
    const req = { user } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(next).toHaveBeenCalled();
  });

  test("should fail on invalid access token", async () => {
    const req = {
      cookies: { access_token: accessToken },
    } as unknown as Request;
    const errorMsg = "bar";
    tokenFamilies.mockVerifyAccessTokenOnce(new Error(errorMsg));
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(401);
    expect(res.send).toHaveBeenCalledWith(errorMsg);
  });

  test("should fill request field user with user id and role", async () => {
    const req = {
      cookies: { access_token: accessToken },
    } as unknown as Request & { user: typeof user };
    await handler(req, res as unknown as Response, next);
    expect(req.user).toEqual(user);
  });

  test("should call next on success", async () => {
    const req = {
      cookies: { access_token: accessToken },
    } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
