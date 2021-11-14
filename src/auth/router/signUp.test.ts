/* eslint-disable jest/expect-expect */
import express from "express";
import supertest from "supertest";
import bcrypt from "bcrypt";

import type TokenFamilies from "../TokenFamilies";
import type UnverifiedUsers from "../UnverifiedUsers";
import MockFindUser from "../utils/testing/MockFindUser";
import MockTockenFamily from "../utils/testing/MockTokenFamily";
import MockTokenFamilies from "../utils/testing/MockTokenFamilies";
import MockUnverifiedUsers from "../utils/testing/MockUnverifiedUsers";
import { verifyToken } from "../utils/jwt";
import userUnprotectedData from "../utils/userUnprotectedData";
import urlOrigin from "../utils/urlOrigin";
import signUp from "./signUp";

jest.mock("bcrypt");
jest.mock("../utils/jwt");
jest.mock("../utils/urlOrigin");

type Roles = string;
const accessToken = "access";
const refreshToken = "refresh";
const unverifiedToken = "unverified";
const findUser = new MockFindUser();
const sendSignUpEmail = jest.fn();
const createUser = jest.fn();
const tokenFamily = new MockTockenFamily(accessToken, refreshToken);
const tokenFamilies = new MockTokenFamilies(tokenFamily);
const unverifiedUsers = new MockUnverifiedUsers(unverifiedToken);
const cookieOptions = { secure: false, httpOnly: true, sameSite: true };
const user = {
  id: "01234",
  name: "foo",
  email: "foo@bar.com",
  hashedPassword: "hash",
};
const userInfo = { username: user.name, email: user.email, password: "bar" };

describe("Auth router sign-up without roles", () => {
  const roleLevels = {};
  const router = signUp(
    findUser,
    sendSignUpEmail,
    createUser,
    roleLevels,
    tokenFamilies as unknown as TokenFamilies<Roles>,
    unverifiedUsers as unknown as UnverifiedUsers<Roles>,
    cookieOptions,
    1234
  );
  const unverifiedUserToken = {
    body: {
      sub: user.name,
      jti: "foobar",
      email: user.email,
    },
  };
  const mockVerifyToken = verifyToken as jest.Mock<Promise<unknown>, unknown[]>;
  const url = "http://123.123.123.123:1234";
  const mockUrlOrigin = urlOrigin as jest.Mock<unknown, unknown[]>;
  const app = express();
  app.use(express.json());
  app.use(router);

  beforeAll(() => {
    mockVerifyToken.mockResolvedValue(unverifiedUserToken);
    mockUrlOrigin.mockReturnValue(url);
    createUser.mockResolvedValue(user);
    unverifiedUsers.take.mockReturnValue(user.hashedPassword);
  });

  beforeEach(() => {
    tokenFamilies.mockClear();
    sendSignUpEmail.mockClear();
    createUser.mockClear();
    findUser.mockReset();
  });

  test("POST / should fail on missing username", async () => {
    await supertest(app)
      .post("/")
      .send({ email: user.email, password: "bar" })
      .expect(400, "Missing mandatory field");
  });

  test("POST / should fail on missing email", async () => {
    await supertest(app)
      .post("/")
      .send({ username: user.name, password: "bar" })
      .expect(400, "Missing mandatory field");
  });

  test("POST / should fail on missing password", async () => {
    await supertest(app)
      .post("/")
      .send({ username: user.name, email: user.email })
      .expect(400, "Missing mandatory field");
  });

  test("POST / should fail on username already taken", async () => {
    findUser.mockResolvedUserIfMatch({ ...user, email: "email@exemple.com" });
    await supertest(app)
      .post("/")
      .send(userInfo)
      .expect(400, "Username or email already taken");
  });

  test("POST / should fail on email already taken", async () => {
    findUser.mockResolvedUserIfMatch({ ...user, name: "bar" });
    await supertest(app)
      .post("/")
      .send(userInfo)
      .expect(400, "Username or email already taken");
  });

  test("POST / should return status 200 on success", async () => {
    await supertest(app).post("/").send(userInfo).expect(200);
  });

  test("POST / should send email to verify user", async () => {
    await supertest(app).post("/").send(userInfo);
    expect(sendSignUpEmail).toHaveBeenCalledWith(
      user.name,
      user.email,
      url,
      unverifiedToken
    );
  });

  test("POST /verify/:token should fail on invalid token", async () => {
    const errorMsg = "bar";
    mockVerifyToken.mockImplementationOnce(() => {
      throw new Error(errorMsg);
    });
    await supertest(app)
      .post(`/verify/${unverifiedToken}`)
      .expect(400, errorMsg);
  });

  test("POST /verify/:token should fail on unverified user not found", async () => {
    unverifiedUsers.take.mockReturnValueOnce(undefined);
    await supertest(app)
      .post(`/verify/${unverifiedToken}`)
      .expect(404, "User already verified");
  });

  test("POST /verify/:token should create user", async () => {
    await supertest(app).post(`/verify/${unverifiedToken}`);
    expect(createUser).toHaveBeenCalledWith(
      user.name,
      user.email,
      user.hashedPassword,
      undefined // role
    );
  });

  test("POST /verify/:token should create token family", async () => {
    await supertest(app).post(`/verify/${unverifiedToken}`).expect(201);
    expect(tokenFamilies.getOrCreate).toHaveBeenCalledWith(user.id);
  });

  test("POST /verify/:token should return status 201 on success", async () => {
    await supertest(app).post(`/verify/${unverifiedToken}`).expect(201);
  });

  test("POST /verify/:token should return user unprotected data", async () => {
    const res = await supertest(app).post(`/verify/${unverifiedToken}`);
    expect(res.body).toEqual(userUnprotectedData(user));
  });

  test("POST /verify/:token should set access and refresh token as cookies", async () => {
    await supertest(app)
      .post(`/verify/${unverifiedToken}`)
      .expect(
        "set-cookie",
        new RegExp(`access_token=${accessToken};.*HttpOnly;.*SameSite=Strict`)
      )
      .expect(
        "set-cookie",
        new RegExp(`refresh_token=${refreshToken};.*HttpOnly;.*SameSite=Strict`)
      );
  });
});

describe("Auth router sign-up with roles", () => {
  const roleLevels = { user: 0, admin: 1 };
  const router = signUp(
    findUser,
    sendSignUpEmail,
    createUser,
    roleLevels,
    tokenFamilies as unknown as TokenFamilies<Roles>,
    unverifiedUsers as unknown as UnverifiedUsers<Roles>,
    cookieOptions,
    1234
  );
  const mockBcryptHash = bcrypt.hash as jest.Mock<Promise<unknown>, unknown[]>;
  const app = express();
  app.use(express.json());
  app.use(router);

  beforeAll(() => {
    unverifiedUsers.take.mockReturnValue(user.hashedPassword);
    mockBcryptHash.mockResolvedValue(user.hashedPassword);
    findUser.mockReset();
  });

  beforeEach(() => {
    unverifiedUsers.mockClear();
  });

  test("POST / should fail on missing role", async () => {
    await supertest(app).post("/").send(userInfo).expect(400, "Missing role");
  });

  test("POST / should fail on invalid role", async () => {
    await supertest(app)
      .post("/")
      .send({ ...userInfo, role: "manager" })
      .expect(400, "Invalid role, expected one of user, admin");
  });

  test("POST / should return status 200 on success", async () => {
    await supertest(app)
      .post("/")
      .send({ ...userInfo, role: "user" })
      .expect(200);
  });

  test("POST / should include role in token body", async () => {
    const role = "user";
    await supertest(app)
      .post("/")
      .send({ ...userInfo, role })
      .expect(200);
    expect(unverifiedUsers.generateUnverifiedUserToken).toHaveBeenCalledWith(
      user.name,
      user.email,
      user.hashedPassword,
      role
    );
  });
});
