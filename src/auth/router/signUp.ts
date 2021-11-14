import type { Request } from "@tlariviere/utils";
import type { CookieOptions } from "express";
import { Router } from "express";
import bcrypt from "bcrypt";
import { asyncHandler } from "@tlariviere/utils";

import type {
  FindUserFunction,
  SendSignUpEmailFunction,
  CreateUserFunction,
  RoleLevels,
  UnverifiedUserTokenBody,
} from "../utils/types";
import { isSupportedRole } from "../utils/types";
import config from "../constants/token";
import UnverifiedUsers from "../UnverifiedUsers";
import TokenFamilies from "../TokenFamilies";
import { verifyToken } from "../utils/jwt";
import userUnprotectedData from "../utils/userUnprotectedData";
import urlOrigin from "../utils/urlOrigin";

/**
 * Create router for signing up user with the following routes:
 *  - POST /
 *      Register temporary unverified user with given data.
 *      Sends email to verify user.
 *  - POST /verify/:token
 *      Check if token is valid and commit user registration.
 *      Return user unprotected data.
 * Require request body to be parsed by bodyParser.
 * @param findUser Functions to find user either by id or login (username or email).
 * @param sendSignUpEmail Function to send email verification when signing up new user.
 * @param createUser Function to create new user.
 * @param roleLevels List of user roles assiociated with their level.
 * @param tokenFamilies Function to send email verification when signing up new user.
 * @param unverifiedUsers Function to update user's password.
 * @param cookieOptions Cookie options to store auth token.
 * @param port Server url port.
 * @returns Express router.
 */
const signUp = <Roles extends string>(
  findUser: FindUserFunction<Roles>,
  sendSignUpEmail: SendSignUpEmailFunction,
  createUser: CreateUserFunction<Roles>,
  roleLevels: RoleLevels<Roles>,
  tokenFamilies: TokenFamilies<Roles>,
  unverifiedUsers: UnverifiedUsers<Roles>,
  cookieOptions: CookieOptions,
  port: number
): Router => {
  const availableRoles = Object.keys(roleLevels);
  const router = Router();

  router.post(
    "/",
    asyncHandler(async (req: Request, res) => {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        res.status(400).send("Missing mandatory field");
        return;
      }

      let role;
      if (availableRoles.length > 0) {
        role = req.body.role;
        if (!role) {
          res.status(400).send("Missing role");
          return;
        }
        if (!isSupportedRole(roleLevels, role)) {
          res
            .status(400)
            .send(`Invalid role, expected one of ${availableRoles.join(", ")}`);
          return;
        }
      }

      const users = await Promise.all([
        findUser.byLogin(username),
        findUser.byLogin(email),
      ]);
      if (users.some((user) => user !== null)) {
        res.status(400).send("Username or email already taken");
        return;
      }

      const hashedPassword = await bcrypt.hash(
        password,
        config.PASSWORD_HASH_ROUNDS
      );
      const token = unverifiedUsers.generateUnverifiedUserToken(
        username,
        email,
        hashedPassword,
        role
      );
      await sendSignUpEmail(username, email, urlOrigin(req, port), token);
      res.sendStatus(200);
    })
  );

  router.post(
    "/verify/:token",
    asyncHandler(async (req: Request, res) => {
      const { token } = req.params;
      let jwt;
      try {
        jwt = await verifyToken(token, config.SIGN_UP_TOKEN_SECRET);
      } catch (err) {
        res.status(400).send((err as Error).message);
        return;
      }

      const {
        jti,
        sub: username,
        email,
        role,
      } = jwt.body as UnverifiedUserTokenBody<Roles>;
      const hashedPassword = unverifiedUsers.take(jti);
      if (!hashedPassword) {
        res.status(404).send("User already verified");
        return;
      }

      const user = await createUser(username, email, hashedPassword, role);
      const tokenFamily = tokenFamilies.getOrCreate(user.id);
      const { accessToken, refreshToken } = tokenFamily.generateTokens(
        user.id,
        user.role
      );
      res
        .status(201)
        .cookie("access_token", accessToken, cookieOptions)
        .cookie("refresh_token", refreshToken, cookieOptions)
        .json(userUnprotectedData(user));
    })
  );

  return router;
};

export default signUp;
