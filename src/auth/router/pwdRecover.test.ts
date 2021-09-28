/* eslint-disable jest/expect-expect */
import express from "express";
import supertest from "supertest";
import bcrypt from "bcrypt";

import MockFindUser from "../testingUtils/MockFindUser";
import { generateToken, verifyToken } from "../jwt";
import pwdRecover from "./pwdRecover";

jest.mock("bcrypt");
jest.mock("../jwt");

describe("Auth router sign-up without roles", () => {
  const recoverToken = "recover";
  const findUser = new MockFindUser();
  const sendPwdRecoverEmail = jest.fn();
  const updatePassword = jest.fn();
  const user = {
    id: "01234",
    name: "foo",
    email: "foo@bar.com",
    hashedPassword: "hash",
  };
  const userUpdateInfo = {
    userId: user.id,
    token: recoverToken,
    newPassword: "bar",
  };
  const router = pwdRecover(findUser, sendPwdRecoverEmail, updatePassword);
  const mockGenerateToken = generateToken as jest.Mock<unknown, unknown[]>;
  const mockVerifyToken = verifyToken as jest.Mock<Promise<unknown>, unknown[]>;
  const mockBcryptHash = bcrypt.hash as jest.Mock<Promise<unknown>, unknown[]>;
  const app = express();
  app.use(express.json());
  app.use(router);

  beforeAll(() => {
    mockGenerateToken.mockReturnValue({ compact: () => recoverToken });
    mockBcryptHash.mockResolvedValue(user.hashedPassword);
    findUser.mockResolvedUserIfMatch(user);
  });

  beforeEach(() => {
    sendPwdRecoverEmail.mockClear();
    updatePassword.mockClear();
    findUser.mockClear();
  });

  test("POST / should fail on missing login", async () => {
    await supertest(app).post("/").send({}).expect(400, "Missing login");
  });

  test("POST / should fail if user can't be found", async () => {
    await supertest(app)
      .post("/")
      .send({ login: "unknown" })
      .expect(400, "User not found");
  });

  test("POST / should return status 200 on success", async () => {
    await supertest(app).post("/").send({ login: user.name }).expect(200);
  });

  test("POST / should send email to verify user", async () => {
    await supertest(app).post("/").send({ login: user.name });
    expect(sendPwdRecoverEmail).toHaveBeenCalledWith(
      user.name,
      user.email,
      `/verify/${user.id}/${recoverToken}`
    );
  });

  test("GET /verify/:userId/:token should fail if user can't be found", async () => {
    await supertest(app)
      .get(`/verify/unknown/${recoverToken}`)
      .expect(400, "User not found");
  });

  test("GET /verify/:userId/:token should fail on invalid token", async () => {
    const errorMsg = "bar";
    mockVerifyToken.mockImplementationOnce(() => {
      throw new Error(errorMsg);
    });
    await supertest(app)
      .get(`/verify/${user.id}/${recoverToken}`)
      .expect(400, errorMsg);
  });

  test("GET /verify/:userId/:token should return status 200 on success", async () => {
    await supertest(app).get(`/verify/${user.id}/${recoverToken}`).expect(200);
  });

  test("POST /update should fail on missing userId", async () => {
    await supertest(app)
      .post("/update")
      .send({ token: recoverToken, newPassword: "bar" })
      .expect(400, "Missing mandatory field");
  });

  test("POST /update should fail on missing token", async () => {
    await supertest(app)
      .post("/update")
      .send({ userId: user.id, newPassword: "bar" })
      .expect(400, "Missing mandatory field");
  });

  test("POST /update should fail on missing newPassword", async () => {
    await supertest(app)
      .post("/update")
      .send({ userId: user.id, token: recoverToken })
      .expect(400, "Missing mandatory field");
  });

  test("POST /update should fail if user can't be found", async () => {
    await supertest(app)
      .post("/update")
      .send({ ...userUpdateInfo, userId: "unknown" })
      .expect(400, "User not found");
  });

  test("POST /update should fail on invalid token", async () => {
    const errorMsg = "bar";
    mockVerifyToken.mockImplementationOnce(() => {
      throw new Error(errorMsg);
    });
    await supertest(app)
      .post("/update")
      .send(userUpdateInfo)
      .expect(400, errorMsg);
  });

  test("POST /update should update password", async () => {
    await supertest(app).post("/update").send(userUpdateInfo);
    expect(updatePassword).toHaveBeenCalledWith(user, user.hashedPassword);
  });

  test("POST /update should return status 200 on success", async () => {
    await supertest(app).post("/update").send(userUpdateInfo).expect(200);
  });
});
