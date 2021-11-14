import type { CookieOptions } from "express";
import bcrypt from "bcrypt";
import type { Request, AsyncRequestHandler } from "@tlariviere/utils";

import type { FindUserFunction } from "../utils/types";
import userUnprotectedData from "../utils/userUnprotectedData";
import TokenFamilies from "../TokenFamilies";

/**
 * Login POST request handler.
 * Require request body to be parsed by bodyParser.
 * If successfull, set access and refresh tokens as cookies and return user unprotected data.
 * @param findUser Functions to find user either by id or login (username or email).
 * @param tokenFamilies Function to send email verification when signing up new user.
 * @param cookieOptions Cookie options to store auth token.
 * @returns Express request handler.
 */
const signIn = <Roles extends string>(
  findUser: FindUserFunction<Roles>,
  tokenFamilies: TokenFamilies<Roles>,
  cookieOptions: CookieOptions
): AsyncRequestHandler => {
  return async (req: Request, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
      res.status(400).send("Missing credentials");
      return;
    }

    const user = await findUser.byLogin(login);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    if (!(await bcrypt.compare(password, user.hashedPassword))) {
      res.status(401).send("Invalid password");
      return;
    }

    const tokenFamily = tokenFamilies.getOrCreate(user.id);
    const { accessToken, refreshToken } = tokenFamily.generateTokens(
      user.id,
      user.role
    );
    res
      .status(200)
      .cookie("access_token", accessToken, cookieOptions)
      .cookie("refresh_token", refreshToken, cookieOptions)
      .json(userUnprotectedData(user));
  };
};

export default signIn;
