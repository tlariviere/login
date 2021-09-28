import type { Response } from "express";

import type { Request } from "../utils/types";
import type TokenFamilies from "./TokenFamilies";
import MockTockenFamily from "./testingUtils/MockTokenFamily";
import MockTokenFamilies from "./testingUtils/MockTokenFamilies";
import MockResponse from "./testingUtils/MockResponse";
import requireRole from "./requireRole";

describe("Require role middleware", () => {
  type Roles = string;
  const tokenFamily = new MockTockenFamily("access", "refresh");
  const tokenFamilies = new MockTokenFamilies(tokenFamily);
  const roleLevels = { user: 0, manager: 1, admin: 2 };
  const requiredRole = "manager";
  const handler = requireRole(
    tokenFamilies as unknown as TokenFamilies<Roles>,
    roleLevels,
    requiredRole
  );
  const res = new MockResponse();
  const next = jest.fn();
  const user = { id: "01234" };

  beforeEach(() => {
    res.mockClear();
    next.mockClear();
  });

  test("should fail if user is not signed in", async () => {
    const req = { cookies: {} } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(401);
  });

  test("should fail on missing role", async () => {
    const req = { user } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(403);
    expect(res.send).toHaveBeenCalledWith(
      `Permission '${requiredRole}' required`
    );
  });

  test("should fail on role level strictly lower to required level", async () => {
    const req = { user: { ...user, role: "user" } } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(403);
    expect(res.send).toHaveBeenCalledWith(
      `Permission '${requiredRole}' required`
    );
  });

  test("should call next on role level equal to required level", async () => {
    const req = { user: { ...user, role: "manager" } } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(next).toHaveBeenCalled();
  });

  test("should call next on role level strictly greater to required level", async () => {
    const req = { user: { ...user, role: "manager" } } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
