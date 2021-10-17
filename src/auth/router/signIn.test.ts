import bcrypt from "bcrypt";
import type { Response } from "express";

import type { Request } from "../../utils/types";
import type TokenFamilies from "../TokenFamilies";
import MockFindUser from "../testingUtils/MockFindUser";
import MockTockenFamily from "../testingUtils/MockTokenFamily";
import MockTokenFamilies from "../testingUtils/MockTokenFamilies";
import MockResponse from "../testingUtils/MockResponse";
import userUnprotectedData from "../userUnprotectedData";
import signIn from "./signIn";

jest.mock("bcrypt");

describe("Auth router sign-in", () => {
  type Roles = string;
  const accessToken = "access";
  const refreshToken = "refresh";
  const findUser = new MockFindUser();
  const tokenFamily = new MockTockenFamily(accessToken, refreshToken);
  const tokenFamilies = new MockTokenFamilies(tokenFamily);
  const cookieOptions = { secure: false, httpOnly: true, sameSite: true };
  const handler = signIn(
    findUser,
    tokenFamilies as unknown as TokenFamilies<Roles>,
    cookieOptions
  );
  const res = new MockResponse();
  const next = jest.fn();
  const user = {
    id: "01234",
    name: "foo",
    email: "foo@bar.com",
    hashedPassword: "hash",
  };
  const mockBcryptCompare = bcrypt.compare as jest.Mock<
    Promise<unknown>,
    unknown[]
  >;

  beforeAll(() => {
    mockBcryptCompare.mockResolvedValue(true);
    findUser.mockResolvedUserIfMatch(user);
  });

  beforeEach(() => {
    tokenFamilies.mockClear();
    res.mockClear();
  });

  test("should fail on empty credentials", async () => {
    const req = { body: {} } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(400);
    expect(res.send).toHaveBeenCalledWith("Missing credentials");
  });

  test("should fail on missing password", async () => {
    const req = { body: { login: "foo" } } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(400);
    expect(res.send).toHaveBeenCalledWith("Missing credentials");
  });

  test("should fail if user can't be found", async () => {
    const req = {
      body: { login: "unknown", password: "bar" },
    } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(400);
    expect(res.send).toHaveBeenCalledWith("User not found");
  });

  test("should fail on invalid password", async () => {
    const req = {
      body: { login: "foo", password: "bar" },
    } as unknown as Request;
    mockBcryptCompare.mockResolvedValueOnce(false);
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(401);
    expect(res.send).toHaveBeenCalledWith("Invalid password");
  });

  test("should create token family if it doesn't exist", async () => {
    const req = {
      body: { login: "foo", password: "bar" },
    } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(tokenFamilies.getOrCreate).toHaveBeenCalledWith(user.id);
  });

  test("should return status 200 on success", async () => {
    const req = {
      body: { login: "foo", password: "bar" },
    } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.statusCode).toBe(200);
  });

  test("should return user unprotected data", async () => {
    const req = {
      body: { login: "foo", password: "bar" },
    } as unknown as Request;
    await handler(req, res as unknown as Response, next);
    expect(res.json).toHaveBeenCalledWith(userUnprotectedData(user));
  });

  test("should set access and refresh token as cookies", async () => {
    const req = {
      body: { login: "foo", password: "bar" },
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
